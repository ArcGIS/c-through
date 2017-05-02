define([
    "esri/core/declare",

    "esri/renderers/SimpleRenderer",
    "esri/symbols/MeshSymbol3D",
    "esri/symbols/FillSymbol3DLayer",
    "esri/renderers/UniqueValueRenderer"

], function (
    declare,
    SimpleRenderer,
    MeshSymbol3D,
    FillSymbol3DLayer,
    UniqueValueRenderer

) {

        return {

            createSimpleRenderer: function () {
                return new SimpleRenderer({
                    symbol: new MeshSymbol3D({
                        symbolLayers: [
                            new FillSymbol3DLayer({
                                material: { color: "#3399FF" }
                            })
                        ]
                    })
                });

            },

            createRenderer: function (values, color, fieldname) {
                return new UniqueValueRenderer({
                    defaultSymbol: new MeshSymbol3D({
                        symbolLayers: [new FillSymbol3DLayer({
                            material: {
                                color: [135, 135, 135, 0.2]
                            }
                        })]
                    }),
                    defaultLabel: "N.A.",
                    field: fieldname,
                    uniqueValueInfos: this.createValueInfos(values, color)
                });
            },

            createValueInfos: function (values, color) {

                var fields = [];

                for (var i = 0; i < values.length; i++) {
                    fields.push({
                        value: values[i],
                        color: color[i]
                    });
                }

                var valueInfos = [];
                for (var j = 0; j < fields.length; j++) {
                    valueInfos.push(
                        {
                            "value": values[j],
                            "symbol": this.createSymbol(color[j]),
                            "label": values[j]
                        }
                    );
                }
                return valueInfos;
            },

            createSymbol: function (color) {
                return new MeshSymbol3D({
                    symbolLayers: [new FillSymbol3DLayer({
                        material: {
                            color: color
                        }
                    })]
                });
            },

            applyOpacity: function (fieldname, alpha, values) {
                var opacVisVar = {
                    type: "opacity",
                    field: fieldname,
                    stops: this.createStops(alpha, values)
                };

                return opacVisVar;

            },

            createStops: function (alpha, values) {
                var stops = [];

                for (var i = 0; i < values.length; i++) {
                    if (i === 0) {
                        stops.push({
                            value: values[0],
                            opacity: alpha[0]
                        });
                    }
                    stops.push({
                        value: values[i],
                        opacity: alpha[i]
                    });
                }
            },

            createRendererVV: function (selection, fieldname) {

                var totalrange = [];

                
                for (var j = 0; j < selection.length; j++) {
                    if (selection[j].attributes[fieldname] !== null) {
                        totalrange.push(selection[j].attributes[fieldname]);
                    }
                }

                var valuemax = Math.ceil(Math.max.apply(Math, totalrange));
                var valuemin = Math.floor(Math.min.apply(Math, totalrange));

                return new UniqueValueRenderer({
                    defaultSymbol: new MeshSymbol3D({
                        symbolLayers: [new FillSymbol3DLayer({
                            material: {
                                color: "white"
                            }
                        })]
                    }),
                    defaultLabel: "N.A.",
                    visualVariables: [{
                        type: "color",
                        field: fieldname,
                        stops: [
                            { value: valuemin, color: "#FBE789" },
                            { value: valuemax, color: "#1B90A7" }
                        ]
                    }]

                });
            },

            createRendererVVbar: function (min, max, color, fieldname) {

                var defaultcolor = [135, 135, 135, 0.2];

                return new UniqueValueRenderer({
                    defaultSymbol: new MeshSymbol3D({
                        symbolLayers: [new FillSymbol3DLayer({
                            material: {
                                color: defaultcolor
                            }
                        })]
                    }),
                    defaultLabel: "N.A.",
                    visualVariables: [{
                        type: "color",
                        field: fieldname,
                        stops: [
                            { value: min-1, color: defaultcolor},
                            { value: min, color: color },
                            { value: max, color: color },
                            { vaue: max+1, color: defaultcolor}
                        ]
                    }]

                });
            }
        };
    }
);