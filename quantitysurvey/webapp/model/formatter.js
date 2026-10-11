sap.ui.define(["sap/ui/core/library"], function (coreLibrary) {
    "use strict";
    var ValueState = coreLibrary.ValueState;
    return {
        statusState: function (sStatus) {
            switch (sStatus) {
                case "Approved": return ValueState.Success;
                case "In Process": return ValueState.Warning;
                case "Rejected": return ValueState.Error;
                default: return ValueState.None;
            }
        },
        statusIcon: function (sStatus) {
            switch (sStatus) {
                case "Approved": return "sap-icon://accept";
                case "In Process": return "sap-icon://pending";
                case "Rejected": return "sap-icon://decline";
                default: return "";
            }
        }
    };
});