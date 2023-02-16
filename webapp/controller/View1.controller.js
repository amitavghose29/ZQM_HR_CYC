sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Fragment, JSONModel, Filter, FilterOperator, MessageBox) {
        "use strict";

        return Controller.extend("com.airbus.zqmhrcyc.controller.View1", {
            onInit: function () {
                this.getView().byId("idFBGrpItemDisc").setVisible(false);
                this.bindDefaultWorkGroup();
            },

            bindDefaultWorkGroup: function () {
                sap.ui.core.BusyIndicator.show();
                var oModel = new JSONModel();
                oModel.setSizeLimit(10000);
                var oDataModel = this.getOwnerComponent().getModel();
                var sPath = "/UserWorkGroupS";
                oDataModel.read(sPath, {
                    success: function (oData, oResult) {
                        sap.ui.core.BusyIndicator.hide();
                        if (oData.results.length > 0) {
                            for (var i = 0; i < oData.results.length; i++) {
                                var oDefaultFlag = oData.results[i].Default;
                                var oDefaultWrkGrp = oData.results[i].WorkGroup;
                                if (oDefaultFlag === true) {
                                    this.oDefaultWorkGroup = oDefaultWrkGrp;
                                    break;
                                }
                            }
                        }
                    }.bind(this),
                    error: function (oError) {
                        sap.ui.core.BusyIndicator.hide();
                        var msg = JSON.parse(oError.responseText).error.message.value;
                        MessageBox.error(msg);
                    }
                });
            },

            onValueHelpRequested: function () {
                this._oDialogHCNC = sap.ui.xmlfragment("com.airbus.zqmhrcyc.fragments.HourcycleNC", this);
                this.getView().addDependent(this._oDialogHCNC);
                this._oDialogHCNC.open();

                sap.ui.core.BusyIndicator.show();
                var oModelSer = new JSONModel();
                var oModelNotif = new JSONModel();
                var oModelAir = new JSONModel();
                oModelSer.setSizeLimit(10000);
                oModelNotif.setSizeLimit(10000);
                oModelAir.setSizeLimit(10000);
                var oDataModel = this.getOwnerComponent().getModel();
                var oFilterSernr = [];
                oFilterSernr.push(new Filter("Key", FilterOperator.EQ, "SERNR"));
                var oFilterNotif = [];
                oFilterNotif.push(new Filter("Key", FilterOperator.EQ, "NOTIF"));
                var oFilterAir = [];
                oFilterAir.push(new Filter("Key", FilterOperator.EQ, "AIR"));
                var sPath = "/f4_genericSet"
                oDataModel.read(sPath, {
                    filters: oFilterSernr,
                    success: function (oData, oResult) {
                        sap.ui.core.BusyIndicator.hide();
                        var data = oData.results;
                        oModelSer.setData(data);
                        sap.ui.getCore().byId("idFBSerNo").setModel(oModelSer, "oSerNoSuggModel");
                    }.bind(this),
                    error: function (oError) {
                        sap.ui.core.BusyIndicator.hide();
                        var msg = JSON.parse(oError.responseText).error.message.value;
                        MessageBox.error(msg);
                    }
                });

                oDataModel.read(sPath, {
                    filters: oFilterNotif,
                    success: function (oData, oResult) {
                        sap.ui.core.BusyIndicator.hide();
                        var data = oData.results;
                        oModelNotif.setData(data);
                        sap.ui.getCore().byId("idFBNcNum").setModel(oModelNotif, "oNcNumSuggModel");
                    }.bind(this),
                    error: function (oError) {
                        sap.ui.core.BusyIndicator.hide();
                        var msg = JSON.parse(oError.responseText).error.message.value;
                        MessageBox.error(msg);
                    }
                });

                oDataModel.read(sPath, {
                    filters: oFilterAir,
                    success: function (oData, oResult) {
                        sap.ui.core.BusyIndicator.hide();
                        var data = oData.results;
                        oModelAir.setData(data);
                        sap.ui.getCore().byId("idFBAircraft").setModel(oModelAir, "oAircrafttNoSuggModel");
                    }.bind(this),
                    error: function (oError) {
                        sap.ui.core.BusyIndicator.hide();
                        var msg = JSON.parse(oError.responseText).error.message.value;
                        MessageBox.error(msg);
                    }
                });
            },

            _handleNCVHClose: function () {
                this._oDialogHCNC.close();
                this._oDialogHCNC.destroy();
            },

            _handleNCSorting: function (oEvent) {
                if (sap.ui.getCore().byId("idNCTable").getBinding("items")) {
                    if (oEvent.getSource().getId() === "idBtnAscSort") {
                        var oSorter = new sap.ui.model.Sorter({
                            path: 'Notification',
                            descending: false
                        });
                    } else if (oEvent.getSource().getId() === "idBtnDescSort") {
                        var oSorter = new sap.ui.model.Sorter({
                            path: 'Notification',
                            descending: true
                        });
                    }
                    var oList = sap.ui.getCore().byId("idNCTable");
                    oList.getBinding("items").sort(oSorter);
                }
            },

            onNCNoFBVHRequest: function (oEvent) {
                this._oNCNoFBVHDialog = sap.ui.xmlfragment("com.airbus.zqmhrcyc.fragments.HCNCNumVH", this);
                this.getView().addDependent(this._oNCNoFBVHDialog);
                this._oNCNoFBVHDialog.open();
                this.oInputNcNoFB = oEvent.getSource();
                sap.ui.core.BusyIndicator.show();
                var oModel = new JSONModel();
                oModel.setSizeLimit(10000);
                var oDataModel = this.getOwnerComponent().getModel();
                var oFilter = [];
                oFilter.push(new Filter("Key", FilterOperator.EQ, "NOTIF"));
                var sPath = "/f4_genericSet"
                oDataModel.read(sPath, {
                    filters: oFilter,
                    success: function (oData, oResult) {
                        sap.ui.core.BusyIndicator.hide();
                        var data = oData.results;
                        oModel.setData(data);
                        this._oNCNoFBVHDialog.setModel(oModel, "oNcNumFBModel");
                    }.bind(this),
                    error: function (oError) {
                        sap.ui.core.BusyIndicator.hide();
                        var msg = JSON.parse(oError.responseText).error.message.value;
                        MessageBox.error(msg);
                    }
                });
            },

            _confirmNcNoFBValueHelpDialog: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem"),
                    oInput = this.oInputNcNoFB;
                if (!oSelectedItem) {
                    oInput.resetProperty("value");
                    return;
                }
                oInput.setValue(oSelectedItem.getTitle());
                this._oNCNoFBVHDialog.destroy();
            },

            _handleNcNoFBValueHelpClose: function () {
                this._oNCNoFBVHDialog.destroy();
            },

            onNcNoFBLiveSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter("Value", FilterOperator.Contains, sValue);
                var oBinding = oEvent.getParameter("itemsBinding");
                oBinding.filter([oFilter]);
            },

            _onNCSearchGo: function () {
                sap.ui.core.BusyIndicator.show();
                var oModel = new JSONModel();
                oModel.setSizeLimit(10000);
                var oDataModel = this.getOwnerComponent().getModel();
                var sValNotif = sap.ui.getCore().byId("idFBNcNum").getValue();
                var sValSerNo = sap.ui.getCore().byId("idFBSerNo").getValue();
                var sValAircraft = sap.ui.getCore().byId("idFBAircraft").getValue();
                var oFilter = [];
                if (sValNotif != "") {
                    oFilter.push(new Filter("Notification", FilterOperator.EQ, sValNotif));
                } if (sValSerNo != "") {
                    oFilter.push(new Filter("SerialNumber", FilterOperator.EQ, sValSerNo));
                } if (sValAircraft != "") {
                    oFilter.push(new Filter("Aircraft", FilterOperator.EQ, sValAircraft));
                }
                var sPath = "/NCSearchSet"
                oDataModel.read(sPath, {
                    filters: oFilter,
                    success: function (oData, oResult) {
                        var data = oData.results;
                        oModel.setData(data);
                        sap.ui.getCore().byId("idNCTable").setModel(oModel, "oNcCopyModel");
                        sap.ui.core.BusyIndicator.hide();
                    }.bind(this),
                    error: function (oError) {
                        sap.ui.core.BusyIndicator.hide();
                        var msg = JSON.parse(oError.responseText).error.message.value;
                        MessageBox.error(msg);
                    }
                });
            },

            handleCloseUserValueHelpNCcopy: function (oEvent) {
                var oSelectedItem = oEvent.getParameters("selectedItem").listItem.getBindingContext("oNcCopyModel").getProperty("Notification");
                var oInput = this.getView().byId("idGenLblNC");
                if (!oSelectedItem) {
                    oInput.resetProperty("value");
                    return;
                }
                oInput.setValue(oSelectedItem);
                this.getView().byId("idFBGrpItemDisc").setVisible(true);
                this._oDialogHCNC.close();
                this._oDialogHCNC.destroy();
            },

            handleNCChange: function () {
                if (this.getView().byId("idGenLblNC").getValue() !== "") {
                    this.getView().byId("idFBGrpItemDisc").setVisible(true);
                } else {
                    this.getView().byId("idFBGrpItemDisc").setVisible(false);
                    this.getView().byId("idGenLblDiscrep").setValue();
                }
            },

            //serial number f4
            onSerNoFBVHRequest: function (oEvent) {
                this._oSerNoFBVHDialog = sap.ui.xmlfragment("com.airbus.zqmhrcyc.fragments.SerNumfbVH", this);
                this.getView().addDependent(this._oSerNoFBVHDialog);
                this._oSerNoFBVHDialog.open();
                this.oInputSerNoFB = oEvent.getSource();
                sap.ui.core.BusyIndicator.show();
                var oModel = new JSONModel();
                oModel.setSizeLimit(10000);
                var oDataModel = this.getOwnerComponent().getModel();
                var oFilter = [];
                oFilter.push(new Filter("Key", FilterOperator.EQ, "SERNR"));
                var sPath = "/f4_genericSet"
                oDataModel.read(sPath, {
                    filters: oFilter,
                    success: function (oData, oResult) {
                        sap.ui.core.BusyIndicator.hide();
                        var data = oData.results;
                        oModel.setData(data);
                        this._oSerNoFBVHDialog.setModel(oModel, "oSerNoFBModel");
                    }.bind(this),
                    error: function (oError) {
                        sap.ui.core.BusyIndicator.hide();
                        var msg = JSON.parse(oError.responseText).error.message.value;
                        MessageBox.error(msg);
                    }
                });
            },

            onSerNoFBLiveSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter("Value", FilterOperator.Contains, sValue);
                var oBinding = oEvent.getParameter("itemsBinding");
                oBinding.filter([oFilter]);
            },

            _handleSerNoFBValueHelpClose: function () {
                this._oSerNoFBVHDialog.close();
                this._oSerNoFBVHDialog.destroy();

            },

            onAircrafthelpRequest: function (oEvent) {
                this._oAircraftDialog = sap.ui.xmlfragment("AircraftfragId", "com.airbus.zqmhrcyc.fragments.AircraftValueHelp", this);
                this.getView().addDependent(this._oAircraftDialog);
                this._oAircraftDialog.open();
                this.oAirCraftInput = oEvent.getSource();
                //F4 Aircraft No s 
                sap.ui.core.BusyIndicator.show();
                var oModel = new JSONModel();
                oModel.setSizeLimit(10000);
                var oDataModel = this.getOwnerComponent().getModel();
                var oFilter = [];
                oFilter.push(new Filter("Key", FilterOperator.EQ, "AIR"));
                var sPath = "/f4_genericSet"
                oDataModel.read(sPath, {
                    filters: oFilter,
                    success: function (oData, oResult) {
                        sap.ui.core.BusyIndicator.hide();
                        var data = oData.results;
                        oModel.setData(data);
                        this._oAircraftDialog.setModel(oModel, "oAircrafttNoModel");
                    }.bind(this),
                    error: function (oError) {
                        sap.ui.core.BusyIndicator.hide();
                        var msg = JSON.parse(oError.responseText).error.message.value;
                        MessageBox.error(msg);
                    }
                });
            },

            onAircraftliveSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter("Value", FilterOperator.Contains, sValue);
                var oBinding = oEvent.getParameter("itemsBinding");
                oBinding.filter([oFilter]);
            },

            _confirmAircraftValueHelpDialog: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem"),
                    oInput = this.oAirCraftInput;
                if (!oSelectedItem) {
                    oInput.resetProperty("value");
                    return;
                }
                oInput.setValue(oSelectedItem.getTitle());
                this._oAircraftDialog.destroy();
            },

            _handleAircraftValueHelpClose: function () {
                this._oAircraftDialog.destroy();
            },

            onValueHelpReqDisc: function (oEvent) {
                this._oDiscDialog = sap.ui.xmlfragment("com.airbus.zqmhrcyc.fragments.DiscrepancyVH", this);
                this.getView().addDependent(this._oDiscDialog);
                this._oDiscDialog.open();
                this.oDiscrepancy = oEvent.getSource();
                this.getOwnerComponent().getModel().metadataLoaded().then(function () {
                    var sEntitypath = this.getOwnerComponent().getModel().createKey("CreateNotificationHeaderSet", {
                        NotificationNo: this.getView().byId("idGenLblNC").getValue(),
                        WorkGroup: this.oDefaultWorkGroup
                    });
                    sap.ui.core.BusyIndicator.show();
                    var oModel = new JSONModel();
                    var oDataModel = this.getOwnerComponent().getModel();
                    var sPath = "/" + sEntitypath;
                    oDataModel.read(sPath, {
                        urlParameters: {
                            "$expand": "to_discrepancy"
                        },
                        success: function (oData, oResult) {
                            sap.ui.core.BusyIndicator.hide();
                            var data = oData.to_discrepancy;
                            oModel.setData(data);
                            this._oDiscDialog.setModel(oModel, "discrmodel");
                        }.bind(this),
                        error: function (oError) {
                            sap.ui.core.BusyIndicator.hide();
                            var msg = JSON.parse(oError.responseText).error.message.value;
                            MessageBox.error(msg);
                        }
                    });
                }.bind(this));
            },

            onDiscSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter("DiscrepancyNo", FilterOperator.Contains, sValue);
                var oBinding = oEvent.getParameter("itemsBinding");
                oBinding.filter([oFilter]);
            },

            _confirmDiscVHDialog: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem"),
                    oInput = this.oDiscrepancy;
                if (!oSelectedItem) {
                    oInput.resetProperty("value");
                    return;
                }
                oInput.setValue(oSelectedItem.getTitle());
                this._oDiscDialog.destroy();
            },

            _cancelDiscVHDialog: function () {
                this._oDiscDialog.destroy();
            },

            onValueHelpReqTrackNo: function (oEvent) {
                sap.ui.core.BusyIndicator.show();
                this._oTrckNoDialog = sap.ui.xmlfragment("com.airbus.zqmhrcyc.fragments.TrackNumVH", this);
                this.getView().addDependent(this._oTrckNoDialog);
                this._oTrckNoDialog.open();
                this.oTrackNum = oEvent.getSource();
                sap.ui.core.BusyIndicator.show();
                var oModel = new JSONModel();
                oModel.setSizeLimit(10000);
                var oDataModel = this.getOwnerComponent().getModel("ZQM_HOURLY_CYCLE_SRV");
                var sPath = "/F4_tracknoSet"
                oDataModel.read(sPath, {
                    success: function (oData, oResult) {
                        sap.ui.core.BusyIndicator.hide();
                        var data = oData.results;
                        oModel.setData(data);
                        this._oTrckNoDialog.setModel(oModel, "TrackNoModel");
                    }.bind(this),
                    error: function (oError) {
                        sap.ui.core.BusyIndicator.hide();
                        var msg = JSON.parse(oError.responseText).error.message.value;
                        MessageBox.error(msg);
                    }
                });

            },

            onTrackNoSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter("TRACKNO", FilterOperator.Contains, sValue);
                var oBinding = oEvent.getParameter("itemsBinding");
                oBinding.filter([oFilter]);
            },

            _confirmTrackNoVHDialog: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem"),
                    oInput = this.oTrackNum;
                if (!oSelectedItem) {
                    oInput.resetProperty("value");
                    return;
                }
                oInput.setValue(oSelectedItem.getTitle());
                this._oTrckNoDialog.destroy();
            },

            _cancelTrackNoVHDialog: function () {
                this._oTrckNoDialog.destroy();
            },

            _onSearchHourlyReport: function () {
                var sValNotif = this.getView().byId("idGenLblNC").getValue();
                var sValDisc = this.getView().byId("idGenLblDiscrep").getValue();
                var sValTrackNo = this.getView().byId("idGenLblTrkNum").getValue();
                if ((sValNotif !== "" && sValDisc !== "" && sValTrackNo !== "") || (sValNotif !== "" && sValTrackNo !== "")) {
                    var oMsg = this.getView().getModel("i18n").getProperty("SechHrlyRptMsg");
                    MessageBox.warning(oMsg);
                    sap.ui.core.BusyIndicator.show();
                    var oModel = new JSONModel();
                    oModel.setSizeLimit(10000);
                    var oDataModel = this.getOwnerComponent().getModel("ZQM_HOURLY_CYCLE_SRV");
                    var oFilter = [];
                    oFilter.push(new Filter("QMNUM", FilterOperator.EQ, sValNotif));
                    oFilter.push(new Filter("FENUM", FilterOperator.EQ, sValDisc));
                    oFilter.push(new Filter("TRACKNO", FilterOperator.EQ, sValTrackNo));
                    var sPath = "/HRS_CYC_GET_DTLSSet"
                    oDataModel.read(sPath, {
                        filters: oFilter,
                        success: function (oData, oResult) {
                            sap.ui.core.BusyIndicator.hide();
                            var data = oData.results[0];
                            oModel.setData(data);
                            this.getView().byId("idSFHourCycle").setModel(oModel, "HourDetModel");
                            if (oData.results.length === 0) {
                                var oNoDataMsg = this.getView().getModel("i18n").getProperty("NoDataMsg");
                                MessageBox.warning(oNoDataMsg);
                            }
                        }.bind(this),
                        error: function (oError) {
                            sap.ui.core.BusyIndicator.hide();
                            var msg = JSON.parse(oError.responseText).error.message.value;
                            MessageBox.error(msg);
                        }
                    });
                } else {
                    sap.ui.core.BusyIndicator.show();
                    var oModel = new JSONModel();
                    oModel.setSizeLimit(10000);
                    var oDataModel = this.getOwnerComponent().getModel("ZQM_HOURLY_CYCLE_SRV");
                    var oFilter = [];
                    oFilter.push(new Filter("QMNUM", FilterOperator.EQ, sValNotif));
                    oFilter.push(new Filter("FENUM", FilterOperator.EQ, sValDisc));
                    oFilter.push(new Filter("TRACKNO", FilterOperator.EQ, sValTrackNo));
                    var sPath = "/HRS_CYC_GET_DTLSSet"
                    oDataModel.read(sPath, {
                        filters: oFilter,
                        success: function (oData, oResult) {
                            sap.ui.core.BusyIndicator.hide();
                            var data = oData.results[0];
                            oModel.setData(data);
                            this.getView().byId("idSFHourCycle").setModel(oModel, "HourDetModel");
                            if (oData.results.length === 0) {
                                var oNoDataMsg = this.getView().getModel("i18n").getProperty("NoDataMsg");
                                MessageBox.warning(oNoDataMsg);
                            }
                        }.bind(this),
                        error: function (oError) {
                            sap.ui.core.BusyIndicator.hide();
                            var msg = JSON.parse(oError.responseText).error.message.value;
                            MessageBox.error(msg);
                        }
                    });
                }
            },

            onPressHourCycleSave: function () {
                if (this.getView().byId("idInpSFStatus").getValue() == "DELETED") {
                    var oDltdMsg = this.getView().getModel("i18n").getProperty("DeletedStatusMsg");
                    MessageBox.warning(oDltdMsg);
                } else {
                    var oNotifNum, oDiscrepancy;
                    var oNotifSF = this.getView().byId("idInpSFNCNo").getValue(),
                        oDiscSF = this.getView().byId("idInpSFDiscNo").getValue(),
                        oNotifFiltBar = this.getView().byId("idGenLblNC").getValue(),
                        oDiscFiltBar = this.getView().byId("idGenLblDiscrep").getValue();
                    var oTrackingNo = this.getView().byId("idInpSFTrckNo").getValue(),
                        oSerialNo = this.getView().byId("idInpSFSNum").getValue(),
                        oRemovedFrom = this.getView().byId("idInpSFRemFrm").getValue(),
                        oHours = this.getView().byId("idInpSFHrs").getValue(),
                        oCycle = this.getView().byId("idInpSFCycle").getValue(),
                        oSnagNo = this.getView().byId("idInpSFSngNum").getValue(),
                        oComments = this.getView().byId("idTAComments").getValue(),
                        oStatus = this.getView().byId("idInpSFStatus").getValue() === "" ? "ADDED" : "CHANGED",
                        oParentPartNo = this.getView().byId("idInpSFPPM").getValue(),
                        oNCDetectedAt = this.getView().byId("idInpSFNCDetAt").getValue(),
                        oUserId = this.getView().byId("idInpSFUsrId").getValue(),
                        oUserChangObj = this.getView().byId("idInpSFPersName").getValue();

                    if (oNotifSF === "" && oNotifFiltBar === "") {
                        oNotifNum = "";
                    } else if (oNotifSF !== "" && oNotifFiltBar === "") {
                        oNotifNum = oNotifSF;
                    } else if (oNotifSF === "" && oNotifFiltBar !== "") {
                        oNotifNum = oNotifFiltBar;
                    } else {
                        oNotifNum = oNotifSF;
                    }

                    if (oDiscSF === "" && oDiscFiltBar == "") {
                        oDiscrepancy = "";
                    } else if (oDiscSF !== "" && oDiscFiltBar === "") {
                        oDiscrepancy = oDiscSF;
                    } else if (oDiscSF === "" && oDiscFiltBar !== "") {
                        oDiscrepancy = oDiscFiltBar;
                    } else {
                        oDiscrepancy = oDiscSF;
                    }

                    var payloadHourCycle = {
                        "QMNUM": oNotifNum, //"200001328" 
                        "FENUM": oDiscrepancy,
                        "TRACKNO": oTrackingNo,
                        "SERNR": oSerialNo.trim(),
                        "REMOVEDFROM": oRemovedFrom.trim(),
                        "ZHOURS": oHours.trim(),
                        "CYCLE": oCycle.trim(),
                        "SNAG": oSnagNo.trim(),
                        "ZHRSCYCLECOMMENT": oComments,
                        "Status": oStatus,
                        "ParntPartNumber": oParentPartNo,
                        "ZLOCPART": oNCDetectedAt,
                        "ERNAM": oUserId,
                        "AENAM": oUserChangObj
                        // "ERDAT": "",
                        // "AEDAT": ""
                    };
                    var oModel = this.getOwnerComponent().getModel("ZQM_HOURLY_CYCLE_SRV");
                    oModel.create("/HRS_CYC_GET_DTLSSet", payloadHourCycle, {
                        method: "POST",
                        success: function (data, response) {
                            sap.ui.core.BusyIndicator.hide();
                            if (response.headers["sap-message"]) {
                                var sMessg = JSON.parse(response.headers["sap-message"]).message;
                                MessageBox.success(sMessg);
                            }
                            if (response.data) {
                                var oTrackNo = response.data.TRACKNO;
                                this.rebindHourlyCyle(oTrackNo);
                            }
                        }.bind(this),
                        error: function (oError) {
                            sap.ui.core.BusyIndicator.hide();
                            var msg = JSON.parse(oError.responseText).error.message.value;
                            MessageBox.error(msg);
                        }
                    });
                }
            },

            handlePressDelete: function () {
                if (this.getView().byId("idInpSFTrckNo").getValue() !== "") {
                    if (this.getView().byId("idInpSFStatus").getValue() == "DELETED") {
                        var oDltMsg = this.getView().getModel("i18n").getProperty("DltStatus");
                        MessageBox.information(oDltMsg);
                    } else {
                        var oConfDltMsg = this.getView().getModel("i18n").getProperty("ConfDltMsg");
                        MessageBox.confirm(oConfDltMsg, {
                            title: "Confirm",
                            onClose: null,
                            styleClass: "",
                            initialFocus: null,
                            textDirection: sap.ui.core.TextDirection.Inherit,
                            onClose: function (sAction) {
                                if (sAction == MessageBox.Action.OK) {
                                    this.handleDeleteRecord();
                                }
                            }.bind(this)
                        });
                    }
                } else {
                    var oDltdTrckMsg = this.getView().getModel("i18n").getProperty("DltTrackMsg");
                    MessageBox.information(oDltdTrckMsg);
                }
            },

            handleDeleteRecord: function () {
                var oNotifNum, oDiscrepancy;
                var oNotifSF = this.getView().byId("idInpSFNCNo").getValue(),
                    oDiscSF = this.getView().byId("idInpSFDiscNo").getValue(),
                    oNotifFiltBar = this.getView().byId("idGenLblNC").getValue(),
                    oDiscFiltBar = this.getView().byId("idGenLblDiscrep").getValue();
                var oTrackingNo = this.getView().byId("idInpSFTrckNo").getValue(),
                    oSerialNo = this.getView().byId("idInpSFSNum").getValue(),
                    oRemovedFrom = this.getView().byId("idInpSFRemFrm").getValue(),
                    oHours = this.getView().byId("idInpSFHrs").getValue(),
                    oCycle = this.getView().byId("idInpSFCycle").getValue(),
                    oSnagNo = this.getView().byId("idInpSFSngNum").getValue(),
                    oComments = this.getView().byId("idTAComments").getValue(),
                    oStatus = "DELETED",
                    oParentPartNo = this.getView().byId("idInpSFPPM").getValue(),
                    oNCDetectedAt = this.getView().byId("idInpSFNCDetAt").getValue(),
                    oUserId = this.getView().byId("idInpSFUsrId").getValue(),
                    oUserChangObj = this.getView().byId("idInpSFPersName").getValue();

                if (oNotifSF === "" && oNotifFiltBar === "") {
                    oNotifNum = "";
                } else if (oNotifSF !== "" && oNotifFiltBar === "") {
                    oNotifNum = oNotifSF;
                } else if (oNotifSF === "" && oNotifFiltBar !== "") {
                    oNotifNum = oNotifFiltBar;
                } else {
                    oNotifNum = oNotifSF;
                }

                if (oDiscSF === "" && oDiscFiltBar == "") {
                    oDiscrepancy = "";
                } else if (oDiscSF !== "" && oDiscFiltBar === "") {
                    oDiscrepancy = oDiscSF;
                } else if (oDiscSF === "" && oDiscFiltBar !== "") {
                    oDiscrepancy = oDiscFiltBar;
                } else {
                    oDiscrepancy = oDiscSF;
                }

                var payloadHourCycle = {
                    "QMNUM": oNotifNum, //"200001328" 
                    "FENUM": oDiscrepancy,
                    "TRACKNO": oTrackingNo,
                    "SERNR": oSerialNo,
                    "REMOVEDFROM": oRemovedFrom,
                    "ZHOURS": oHours,
                    "CYCLE": oCycle,
                    "SNAG": oSnagNo,
                    "ZHRSCYCLECOMMENT": oComments,
                    "Status": oStatus,
                    "ParntPartNumber": oParentPartNo,
                    "ZLOCPART": oNCDetectedAt,
                    "ERNAM": oUserId,
                    "AENAM": oUserChangObj
                };
                var oModel = this.getOwnerComponent().getModel("ZQM_HOURLY_CYCLE_SRV");
                oModel.create("/HRS_CYC_GET_DTLSSet", payloadHourCycle, {
                    method: "POST",
                    success: function (data, response) {
                        sap.ui.core.BusyIndicator.hide();
                        if (response.headers["sap-message"]) {
                            var sMessg = JSON.parse(response.headers["sap-message"]).message;
                            MessageBox.success(sMessg);
                        }
                        if (response.data) {
                            var oTrackNo = response.data.TRACKNO;
                            this.rebindHourlyCyle(oTrackNo);
                        }
                    }.bind(this),
                    error: function (oError) {
                        sap.ui.core.BusyIndicator.hide();
                        var msg = JSON.parse(oError.responseText).error.message.value;
                        MessageBox.error(msg);
                    }
                });
            },

            rebindHourlyCyle: function (oTrackNo) {
                sap.ui.core.BusyIndicator.show();
                var oModel = new JSONModel();
                oModel.setSizeLimit(10000);
                var oDataModel = this.getOwnerComponent().getModel("ZQM_HOURLY_CYCLE_SRV");
                var sValNotif = "";
                var sValDisc = "";
                var sValTrackNo = oTrackNo;
                var oFilter = [];
                oFilter.push(new Filter("QMNUM", FilterOperator.EQ, sValNotif));
                oFilter.push(new Filter("FENUM", FilterOperator.EQ, sValDisc));
                oFilter.push(new Filter("TRACKNO", FilterOperator.EQ, sValTrackNo));
                var sPath = "/HRS_CYC_GET_DTLSSet"
                oDataModel.read(sPath, {
                    filters: oFilter,
                    success: function (oData, oResult) {
                        sap.ui.core.BusyIndicator.hide();
                        var data = oData.results[0];
                        oModel.setData(data);
                        this.getView().byId("idSFHourCycle").setModel(oModel, "HourDetModel");
                    }.bind(this),
                    error: function (oError) {
                        sap.ui.core.BusyIndicator.hide();
                        var msg = JSON.parse(oError.responseText).error.message.value;
                        MessageBox.error(msg);
                    }
                });
            }

        });
    });
