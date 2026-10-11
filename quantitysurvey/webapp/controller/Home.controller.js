sap.ui.define([
    "./BaseController",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
], function (BaseController, Fragment, Filter, FilterOperator, JSONModel, MessageBox) {
    "use strict";
    // input local id -> valueHelpType in ValueHelpSet (NEEDS CONFIRMATION from backend)
    var mValueHelpTypes = {
        CompanyCode: "CompCode",
        Contract: "ContCode",
        Vendor: "Vendor",
        Project: "Project"
    };

    // input local id -> i18n key of its label (existing keys)
    var mTitleKeys = {
        CompanyCode: "CompCode",
        Contract: "Contract",
        Vendor: "Contractor",
        Project: "Project"
    };
    return BaseController.extend("cic.org.quantitysurvey.controller.Home", {

        onTableUpdateFinished: function (oEvent) {
            this.getView().getModel("home").setProperty("/totalRecords", oEvent.getParameter("total"));
        },
        onRowPress: function (oEvent) {
            var sPoNumber = oEvent.getSource().getBindingContext("dataModel").getProperty("PoNumber");
            this.getRouter().navTo("RouteDetails", { poNumber: sPoNumber });
        },



        onValueHelpPress: function (oEvent) {
            var oInput = oEvent.getSource();
            var sField = this.getView().getLocalId(oInput.getId());
            var oBundle = this.getView().getModel("i18n").getResourceBundle();

            this._sValueHelpField = sField;
            oInput.setBusy(true);

            Promise.all([
                this._readValueHelp(mValueHelpTypes[sField]),
                this._getValueHelpDialog()
            ]).then(function (aResult) {
                var oDialog = aResult[1];
                oDialog.getModel("vhDialog").setData({
                    title: oBundle.getText(mTitleKeys[sField]),
                    ValueHelpSet: aResult[0]
                });
                oDialog.open("");
            }).catch(function (oError) {
                MessageBox.error(oBundle.getText("ValueHelpLoadError"), {
                    details: oError && oError.message
                });
            }).finally(function () {
                oInput.setBusy(false);
            });
        },

        // MOCK implementation: reads the local JSON model.
        // Replace the body with the V2 read below once the service is confirmed.
        _readValueHelp: function (sType) {
            var oModel = this.getOwnerComponent().getModel("valueHelp");
            if (!oModel) {
                return Promise.reject(new Error("Model 'valueHelp' not found. Check manifest.json models."));
            }
            var aItems = (oModel.getProperty("/ValueHelpSet") || []).filter(function (oItem) {
                return oItem.valueHelpType === sType;
            });
            return Promise.resolve(aItems);
        },

        onSearchValueHelp: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter({
                filters: [
                    new Filter("idNumber", FilterOperator.Contains, sValue),
                    new Filter("idText", FilterOperator.Contains, sValue)
                ],
                and: false
            });
            oEvent.getSource().getBinding("items").filter([oFilter]);
        },

        onConfirmValueHelp: function (oEvent) {
            var oItem = oEvent.getParameter("selectedItem");
            if (oItem) {
                this.getView().getModel("home").setProperty("/Filter" + this._sValueHelpField, oItem.getTitle());
            }
            this._resetValueHelpFilter(oEvent);
        },

        onCancelValueHelp: function (oEvent) {
            this._resetValueHelpFilter(oEvent);
        },

        _resetValueHelpFilter: function (oEvent) {
            var oBinding = oEvent.getSource().getBinding("items");
            if (oBinding) {
                oBinding.filter([]);
            }
        },

        // _getValueHelpDialog: function () {
        //     if (!this._pValueHelp) {
        //         this._pValueHelp = Fragment.load({
        //             id: this.getView().getId(),
        //             name: "cic.org.quantitysurvey.view.Fragments.ValueHelp",
        //             controller: this
        //         }).then(function (oDialog) {
        //             oDialog.setModel(new JSONModel({ title: "", ValueHelpSet: [] }), "vhDialog");
        //             this.getView().addDependent(oDialog);
        //             return oDialog;
        //         }.bind(this));
        //     }
        //     return this._pValueHelp;
        // }
        _getValueHelpDialog: function () {
            if (!this._pValueHelp) {
                this._pValueHelp = Fragment.load({
                    id: this.getView().getId(),
                    name: "cic.org.quantitysurvey.view.fragments.ValueHelp",
                    controller: this
                }).then(function (oDialog) {
                    oDialog.setModel(new JSONModel({ title: "", ValueHelpSet: [] }), "vhDialog");
                    this.getView().addDependent(oDialog);
                    return oDialog;
                }.bind(this)).catch(function (oError) {
                    this._pValueHelp = null;   // allow a retry after a failed load
                    throw oError;              // still reaches the MessageBox in onValueHelpPress
                }.bind(this));
            }
            return this._pValueHelp;
        }

    });
}); ``
