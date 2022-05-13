// Type definitions for @ag-grid-community/core v27.3.0
// Project: https://www.ag-grid.com/
// Definitions by: Niall Crosby <https://github.com/ag-grid/>
import { IComponent } from "../../interfaces/iComponent";
import { AgGridCommon } from "../../interfaces/iCommon";
import { Component } from "../../widgets/component";
export interface ILoadingOverlayParams extends AgGridCommon {
}
export interface ILoadingOverlayComp extends IComponent<ILoadingOverlayParams> {
}
export declare class LoadingOverlayComponent extends Component implements ILoadingOverlayComp {
    private static DEFAULT_LOADING_OVERLAY_TEMPLATE;
    constructor();
    destroy(): void;
    init(params: ILoadingOverlayParams): void;
}