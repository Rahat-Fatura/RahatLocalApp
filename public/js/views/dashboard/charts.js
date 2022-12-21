(function () {
    let cardColor, headingColor, legendColor, labelColor, borderColor;
    if (isDarkStyle) {
        cardColor = config.colors_dark.cardColor;
        labelColor = config.colors_dark.textMuted;
        legendColor = config.colors_dark.bodyColor;
        headingColor = config.colors_dark.headingColor;
        borderColor = config.colors_dark.borderColor;
    } else {
        cardColor = config.colors.cardColor;
        labelColor = config.colors.textMuted;
        legendColor = config.colors.bodyColor;
        headingColor = config.colors.headingColor;
        borderColor = config.colors.borderColor;
    }

    // Support Tracker - Radial Bar Chart
    // --------------------------------------------------------------------
    const invoiceTrackerEl = document.querySelector("#invoiceTracker"),
        invoiceTrackerOptions = {
            series: [$("#total-percent-invoice").val()],
            labels: ["Gönderim Oranı"],
            chart: {
                height: 360,
                type: "radialBar",
            },
            plotOptions: {
                radialBar: {
                    offsetY: 10,
                    startAngle: -140,
                    endAngle: 135,
                    hollow: {
                        size: "65%",
                    },
                    track: {
                        background: cardColor,
                        strokeWidth: "100%",
                    },
                    dataLabels: {
                        name: {
                            offsetY: -20,
                            color: labelColor,
                            fontSize: "13px",
                            fontWeight: "400",
                            fontFamily: "Public Sans",
                        },
                        value: {
                            offsetY: 10,
                            color: headingColor,
                            fontSize: "38px",
                            fontWeight: "600",
                            fontFamily: "Public Sans",
                        },
                    },
                },
            },
            colors: [config.colors.primary],
            fill: {
                type: "gradient",
                gradient: {
                    shade: "dark",
                    shadeIntensity: 0.5,
                    gradientToColors: [config.colors.primary],
                    inverseColors: true,
                    opacityFrom: 1,
                    opacityTo: 0.6,
                    stops: [30, 70, 100],
                },
            },
            stroke: {
                dashArray: 10,
            },
            grid: {
                padding: {
                    top: -20,
                    bottom: 5,
                },
            },
            states: {
                hover: {
                    filter: {
                        type: "none",
                    },
                },
                active: {
                    filter: {
                        type: "none",
                    },
                },
            },
            responsive: [
                {
                    breakpoint: 1025,
                    options: {
                        chart: {
                            height: 330,
                        },
                    },
                },
                {
                    breakpoint: 769,
                    options: {
                        chart: {
                            height: 280,
                        },
                    },
                },
            ],
        };
    if (typeof invoiceTrackerEl !== undefined && invoiceTrackerEl !== null) {
        const invoiceTracker = new ApexCharts(
            invoiceTrackerEl,
            invoiceTrackerOptions
        );
        invoiceTracker.render();
    }

    const despatchTrackerEl = document.querySelector("#despatchTracker"),
        despatchTrackerOptions = {
            series: [$("#total-percent-despatch").val()],
            labels: ["Gönderim Oranı"],
            chart: {
                height: 360,
                type: "radialBar",
            },
            plotOptions: {
                radialBar: {
                    offsetY: 10,
                    startAngle: -140,
                    endAngle: 135,
                    hollow: {
                        size: "65%",
                    },
                    track: {
                        background: cardColor,
                        strokeWidth: "100%",
                    },
                    dataLabels: {
                        name: {
                            offsetY: -20,
                            color: labelColor,
                            fontSize: "13px",
                            fontWeight: "400",
                            fontFamily: "Public Sans",
                        },
                        value: {
                            offsetY: 10,
                            color: headingColor,
                            fontSize: "38px",
                            fontWeight: "600",
                            fontFamily: "Public Sans",
                        },
                    },
                },
            },
            colors: [config.colors.primary],
            fill: {
                type: "gradient",
                gradient: {
                    shade: "dark",
                    shadeIntensity: 0.5,
                    gradientToColors: [config.colors.primary],
                    inverseColors: true,
                    opacityFrom: 1,
                    opacityTo: 0.6,
                    stops: [30, 70, 100],
                },
            },
            stroke: {
                dashArray: 10,
            },
            grid: {
                padding: {
                    top: -20,
                    bottom: 5,
                },
            },
            states: {
                hover: {
                    filter: {
                        type: "none",
                    },
                },
                active: {
                    filter: {
                        type: "none",
                    },
                },
            },
            responsive: [
                {
                    breakpoint: 1025,
                    options: {
                        chart: {
                            height: 330,
                        },
                    },
                },
                {
                    breakpoint: 769,
                    options: {
                        chart: {
                            height: 280,
                        },
                    },
                },
            ],
        };
    if (typeof despatchTrackerEl !== undefined && despatchTrackerEl !== null) {
        const despatchTracker = new ApexCharts(
            despatchTrackerEl,
            despatchTrackerOptions
        );
        despatchTracker.render();
    }
})();
