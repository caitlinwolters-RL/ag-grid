import { ICellRendererComp, ICellRendererParams } from "@ag-grid-community/core";

export class MedalRenderer implements ICellRendererComp {
    eGui!: HTMLSpanElement;
    eButton!: HTMLButtonElement;
    buttonListener: any;
    value: any;

    init(params: ICellRendererParams) {
        this.value = params.valueFormatted ? params.valueFormatted : params.value;
        this.eGui = document.createElement('span')

        const label = document.createElement('span');
        label.innerText = params.value;
        this.eGui.appendChild(label);

        this.eButton = document.createElement('button');
        this.buttonListener = this.buttonClicked.bind(this);
        this.eButton.addEventListener("click", this.buttonListener);
        this.eButton.innerHTML = 'Push For Total';

        this.eGui.appendChild(label);
        this.eGui.appendChild(this.eButton);
    }

    buttonClicked() {
        alert(`${this.value} medals won!`)
    }

    getGui() {
        return this.eGui
    }

    refresh(params: ICellRendererParams) {
        return false;
    }

    destroy() {
        this.eButton.removeEventListener("click", this.buttonListener);
    }
}
