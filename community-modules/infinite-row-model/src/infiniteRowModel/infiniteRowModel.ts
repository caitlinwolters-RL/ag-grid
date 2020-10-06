import {
    _,
    Autowired,
    Bean,
    BeanStub,
    ColumnApi,
    Constants,
    Events,
    FilterManager,
    GridApi,
    GridOptionsWrapper,
    IDatasource,
    ModelUpdatedEvent,
    NumberSequence,
    PostConstruct,
    PreDestroy,
    RowBounds,
    RowDataTransaction,
    RowNode,
    RowNodeBlockLoader,
    RowNodeCache,
    RowRenderer,
    SelectionController,
    SortController,
    IInfiniteRowModel
} from "@ag-grid-community/core";
import { InfiniteCache, InfiniteCacheParams } from "./infiniteCache";

@Bean('rowModel')
export class InfiniteRowModel extends BeanStub implements IInfiniteRowModel {

    @Autowired('gridOptionsWrapper') private readonly gridOptionsWrapper: GridOptionsWrapper;
    @Autowired('filterManager') private readonly filterManager: FilterManager;
    @Autowired('sortController') private readonly sortController: SortController;
    @Autowired('selectionController') private readonly selectionController: SelectionController;
    @Autowired('gridApi') private readonly gridApi: GridApi;
    @Autowired('columnApi') private readonly columnApi: ColumnApi;
    @Autowired('rowRenderer') private readonly rowRenderer: RowRenderer;

    private infiniteCache: InfiniteCache | null;
    private rowNodeBlockLoader: RowNodeBlockLoader | null;

    private datasource: IDatasource | null | undefined;

    private rowHeight: number;

    private cacheParams: InfiniteCacheParams;

    public getRowBounds(index: number): RowBounds {
        return {
            rowHeight: this.rowHeight,
            rowTop: this.rowHeight * index
        };
    }

    // we don't implement as lazy row heights is not supported in this row model
    public ensureRowHeightsValid(startPixel: number, endPixel: number, startLimitIndex: number, endLimitIndex: number): boolean {
        return false;
    }

    @PostConstruct
    public init(): void {
        if (!this.gridOptionsWrapper.isRowModelInfinite()) {
            return;
        }

        this.rowHeight = this.gridOptionsWrapper.getRowHeightAsNumber();

        this.addEventListeners();

        this.addDestroyFunc(() => this.destroyCache());
    }

    public start(): void {
        this.setDatasource(this.gridOptionsWrapper.getDatasource());
    }

    @PreDestroy
    private destroyDatasource(): void {
        if (this.datasource) {
            this.getContext().destroyBean(this.datasource);
            this.rowRenderer.datasourceChanged();
            this.datasource = null;
        }
    }

    public isLastRowFound(): boolean {
        return this.infiniteCache!=null && this.infiniteCache.isMaxRowFound();
    }

    private addEventListeners(): void {
        this.addManagedListener(this.eventService, Events.EVENT_FILTER_CHANGED, this.onFilterChanged.bind(this));
        this.addManagedListener(this.eventService, Events.EVENT_SORT_CHANGED, this.onSortChanged.bind(this));
        this.addManagedListener(this.eventService, Events.EVENT_COLUMN_EVERYTHING_CHANGED, this.onColumnEverything.bind(this));
    }

    private onFilterChanged(): void {
        this.reset();
    }

    private onSortChanged(): void {
        this.reset();
    }

    private onColumnEverything(): void {
        let resetRequired;
        // if cache params, we require reset only if sort model has changed. we don't need to check
        // for filter model, as the filter manager will fire an event when columns change that result
        // in the filter changing.
        if (this.cacheParams) {
            resetRequired = this.isSortModelDifferent();
        } else {
            // if no cacheParams, means first time creating the cache, so always create one
            resetRequired = true;
        }
        if (resetRequired) {
            this.reset();
        }
    }

    private isSortModelDifferent(): boolean {
        return !_.jsonEquals(this.cacheParams.sortModel, this.sortController.getSortModel());
    }

    public getType(): string {
        return Constants.ROW_MODEL_TYPE_INFINITE;
    }

    public setDatasource(datasource: IDatasource | undefined): void {
        this.destroyDatasource();
        this.datasource = datasource;

        // only reset if we have a valid datasource to working with
        if (datasource) {
            this.reset();
        }
    }

    public isEmpty(): boolean {
        return !this.infiniteCache;
    }

    public isRowsToRender(): boolean {
        return !!this.infiniteCache;
    }

    public getNodesInRangeForSelection(firstInRange: RowNode, lastInRange: RowNode): RowNode[] {
        return this.infiniteCache ? this.infiniteCache.getRowNodesInRange(firstInRange, lastInRange) : [];
    }

    private reset() {
        // important to return here, as the user could be setting filter or sort before
        // data-source is set
        if (!this.datasource) {
            return;
        }

        // if user is providing id's, then this means we can keep the selection between datasource hits,
        // as the rows will keep their unique id's even if, for example, server side sorting or filtering
        // is done.
        const userGeneratingIds = _.exists(this.gridOptionsWrapper.getRowNodeIdFunc());

        if (!userGeneratingIds) {
            this.selectionController.reset();
        }

        this.resetCache();

        const event: ModelUpdatedEvent = this.createModelUpdatedEvent();
        this.eventService.dispatchEvent(event);
    }

    private createModelUpdatedEvent(): ModelUpdatedEvent {
        return {
            type: Events.EVENT_MODEL_UPDATED,
            api: this.gridApi,
            columnApi: this.columnApi,
            // not sure if these should all be false - noticed if after implementing,
            // maybe they should be true?
            newPage: false,
            newData: false,
            keepRenderedRows: false,
            animate: false
        };
    }

    private resetCache(): void {
        // if not first time creating a cache, need to destroy the old one
        this.destroyCache();

        const maxConcurrentRequests = this.gridOptionsWrapper.getMaxConcurrentDatasourceRequests();
        const blockLoadDebounceMillis = this.gridOptionsWrapper.getBlockLoadDebounceMillis();

        // there is a bi-directional dependency between the loader and the cache,
        // so we create loader here, and then pass dependencies in setDependencies() method later
        this.rowNodeBlockLoader = this.createBean(new RowNodeBlockLoader(maxConcurrentRequests, blockLoadDebounceMillis));

        this.cacheParams = {
            // the user provided datasource
            datasource: this.datasource,

            // sort and filter model
            filterModel: this.filterManager.getFilterModel(),
            sortModel: this.sortController.getSortModel(),

            rowNodeBlockLoader: this.rowNodeBlockLoader,

            // properties - this way we take a snapshot of them, so if user changes any, they will be
            // used next time we create a new cache, which is generally after a filter or sort change,
            // or a new datasource is set
            maxConcurrentRequests: this.defaultIfInvalid(maxConcurrentRequests, 2),
            initialRowCount: this.defaultIfInvalid(this.gridOptionsWrapper.getInfiniteInitialRowCount(), 1),
            maxBlocksInCache: this.gridOptionsWrapper.getMaxBlocksInCache(),
            rowHeight: this.gridOptionsWrapper.getRowHeightAsNumber(),

            // if user doesn't provide overflow, we use default overflow of 1, so user can scroll past
            // the current page and request first row of next page
            overflowSize: this.defaultIfInvalid(this.gridOptionsWrapper.getCacheOverflowSize(), 1),

            // page size needs to be 1 or greater. having it at 1 would be silly, as you would be hitting the
            // server for one page at a time. so the default if not specified is 100.
            blockSize: this.defaultIfInvalid(this.gridOptionsWrapper.getCacheBlockSize(), 100),

            // the cache could create this, however it is also used by the pages, so handy to create it
            // here as the settings are also passed to the pages
            lastAccessedSequence: new NumberSequence()
        } as InfiniteCacheParams;

        this.infiniteCache = this.createBean(new InfiniteCache(this.cacheParams));
        this.infiniteCache.addEventListener(RowNodeCache.EVENT_CACHE_UPDATED, this.onCacheUpdated.bind(this));
    }

    private defaultIfInvalid(value: number, defaultValue: number): number {
        return value > 0 ? value : defaultValue;
    }

    private destroyCache(): void {
        if (this.infiniteCache) {
            this.infiniteCache = this.destroyBean(this.infiniteCache);
        }

        if (this.rowNodeBlockLoader) {
            this.rowNodeBlockLoader = this.destroyBean(this.rowNodeBlockLoader);
        }
    }

    private onCacheUpdated(): void {
        const event: ModelUpdatedEvent = this.createModelUpdatedEvent();
        this.eventService.dispatchEvent(event);
    }

    public getRow(rowIndex: number): RowNode | null {
        return this.infiniteCache ? this.infiniteCache.getRow(rowIndex) : null;
    }

    public getRowNode(id: string): RowNode | null {
        let result: RowNode | null = null;
        this.forEachNode(rowNode => {
            if (rowNode.id === id) {
                result = rowNode;
            }
        });
        return result;
    }

    public forEachNode(callback: (rowNode: RowNode, index: number) => void): void {
        if (this.infiniteCache) {
            this.infiniteCache.forEachNodeDeep(callback, new NumberSequence());
        }
    }

    public getCurrentPageHeight(): number {
        return this.getRowCount() * this.rowHeight;
    }

    public getTopLevelRowCount(): number {
        return this.getRowCount();
    }

    public getTopLevelRowDisplayedIndex(topLevelIndex: number): number {
        return topLevelIndex;
    }

    public getRowIndexAtPixel(pixel: number): number {
        if (this.rowHeight !== 0) { // avoid divide by zero error
            const rowIndexForPixel = Math.floor(pixel / this.rowHeight);
            const lastRowIndex = this.getRowCount() - 1;
            if (rowIndexForPixel > lastRowIndex) {
                return lastRowIndex;
            } else {
                return rowIndexForPixel;
            }
        } else {
            return 0;
        }
    }

    public getRowCount(): number {
        return this.infiniteCache ? this.infiniteCache.getVirtualRowCount() : 0;
    }

    public updateRowData(transaction: RowDataTransaction): void {
        if (_.exists(transaction.remove) || _.exists(transaction.update)) {
            console.warn('ag-Grid: updateRowData for InfiniteRowModel does not support remove or update, only add');
            return;
        }

        if (_.missing(transaction.addIndex)) {
            console.warn('ag-Grid: updateRowData for InfiniteRowModel requires add and addIndex to be set');
            return;
        }

        if (this.infiniteCache) {
            this.infiniteCache.insertItemsAtIndex(transaction.addIndex, transaction.add);
        }
    }

    public isRowPresent(rowNode: RowNode): boolean {
        return false;
    }

    public refreshCache(): void {
        if (this.infiniteCache) {
            this.infiniteCache.refreshCache();
        }
    }

    public purgeCache(): void {
        if (this.infiniteCache) {
            this.infiniteCache.purgeCache();
        }
    }

    public getVirtualRowCount(): number | null {
        if (this.infiniteCache) {
            return this.infiniteCache.getVirtualRowCount();
        } else {
            return null;
        }
    }

    public isMaxRowFound(): boolean | undefined {
        if (this.infiniteCache) {
            return this.infiniteCache.isMaxRowFound();
        }
    }

    public setVirtualRowCount(rowCount: number, maxRowFound?: boolean): void {
        if (this.infiniteCache) {
            this.infiniteCache.setVirtualRowCount(rowCount, maxRowFound);
        }
    }

    public getBlockState(): any {
        if (this.rowNodeBlockLoader) {
            return this.rowNodeBlockLoader.getBlockState();
        } else {
            return null;
        }
    }
}
