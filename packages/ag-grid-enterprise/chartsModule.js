"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ag_grid_community_1 = require("ag-grid-community");
var chartService_1 = require("./dist/lib/chartAdaptor/chartService");
var chartTranslator_1 = require("./dist/lib/chartAdaptor/chartComp/chartTranslator");
exports.ChartsModule = {
    moduleName: "chartsModule" /* ChartsModule */,
    enterpriseBeans: [
        chartService_1.ChartService, chartTranslator_1.ChartTranslator
    ],
    enterpriseComponents: []
};
ag_grid_community_1.Grid.addModule([exports.ChartsModule]);
