import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { FactureService } from '../charts/../../uikit/../../service/facture.service';

@Component({
    templateUrl: './chartsdemo.component.html'
})
export class ChartsDemoComponent implements OnInit, OnDestroy {
    lineData: any;
    lineOptions: any;
    pieData: any;
    pieOptions: any;
    barData: any;
    barOptions: any;
    subscription: Subscription;
    barDataCW: any;
    barOptionsCW: any;

    constructor(public layoutService: LayoutService, private factureService: FactureService) {
        this.subscription = this.layoutService.configUpdate$.subscribe(config => {
            this.loadData();
        });
    }

    ngOnInit() {
        this.pieData = this.createEmptyPieData(); // Initialisation avec des données vides
        this.loadData();
    }

    createEmptyPieData() {
        return {
            labels: ['Facture non réglée', 'Facture réglée'],
            datasets: [
                {
                    data: [0, 0],
                    backgroundColor: ['indigo', 'teal'], // Utilisez les couleurs directement
                    hoverBackgroundColor: ['indigo', 'teal']
                }
            ]
        };
    }

    loadData() {
        this.loadPieChartData();
        this.loadLineChartData();
        this.loadBarChartData();
        this.loadBarChartDataByWeek();
    }

    loadPieChartData() {
        const statusRegles = 'réglé';
        const statusNonRegles = 'non réglé';

        this.factureService.getFacturesByStatus(statusRegles).subscribe(facturesRegles => {
            this.factureService.getFacturesByStatus(statusNonRegles).subscribe(facturesNonRegles => {
                const totalFactures = facturesRegles.length + facturesNonRegles.length;
                const pourcentageRegles = (facturesRegles.length / totalFactures) * 100;
                const pourcentageNonRegles = (facturesNonRegles.length / totalFactures) * 100;
                const documentStyle = getComputedStyle(document.documentElement);
                const textColor = documentStyle.getPropertyValue('--text-color');

                this.pieData = {
                    labels: ['Facture non réglée', 'Facture réglée'],
                    datasets: [
                        {
                            data: [pourcentageNonRegles, pourcentageRegles],
                            // backgroundColor: ['indigo', 'teal'],
                            // hoverBackgroundColor: ['indigo', 'teal']
                            backgroundColor: [
                                documentStyle.getPropertyValue('--indigo-500'),
                                documentStyle.getPropertyValue('--purple-500'),
                                documentStyle.getPropertyValue('--teal-500')
                            ],
                            hoverBackgroundColor: [
                                documentStyle.getPropertyValue('--indigo-400'),
                                documentStyle.getPropertyValue('--purple-400'),
                                documentStyle.getPropertyValue('--teal-400')
                            ]
                        }
                    ]
                };
                this.pieOptions = {
                    plugins: {
                        legend: {
                            labels: {
                                usePointStyle: true,
                                color: textColor
                            }
                        }
                    }
                };
            });
        });
    }

    loadLineChartData() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        const yearsToFetch = [2019, 2020, 2021, 2022, 2023]; // Les années dont vous souhaitez récupérer les données

        const dataPromises = yearsToFetch.map(year => {
            return this.factureService.calculateCAByYear(year).toPromise();
        });

        Promise.all(dataPromises).then(data => {
            this.lineData = {
                labels: yearsToFetch,
                datasets: [
                    {
                        label: 'Chiffre d\'affaires par année',
                        data: data,
                        fill: false,
                        backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                        borderColor: documentStyle.getPropertyValue('--primary-500'),
                        tension: .4
                    }
                ]
            };
            // Assurez-vous d'adapter les options du graphique en fonction de vos besoins
            this.lineOptions = {
                plugins: {
                    legend: {
                        labels: {
                            fontColor: textColor
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: textColorSecondary
                        },
                        grid: {
                            color: surfaceBorder,
                            drawBorder: false
                        }
                    },
                    y: {
                        ticks: {
                            color: textColorSecondary
                        },
                        grid: {
                            color: surfaceBorder,
                            drawBorder: false
                        }
                    },
                }
            };
        }).catch(error => {
            console.error('Une erreur est survenue lors de la récupération des données : ', error);
        });
    }
    loadBarChartData() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
        const yearsToFetch = [2022, 2023]; // Année pour laquelle vous souhaitez récupérer les données
        //const monthsToFetch = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; // Les mois dont vous souhaitez récupérer les données

        const dataPromises = yearsToFetch.map(year => {
            const monthsToFetch = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
            return Promise.all(
                monthsToFetch.map(month => this.factureService.calculateCAByMonthAndYear(month, year).toPromise())
            );
        });

        Promise.all(dataPromises).then(data => {
            this.barData = {
                labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], // Correspond aux mois
                datasets: [
                    {
                        label: 'Chiffre d\'affaires par mois de l\'année ' + yearsToFetch[0],
                        data: data[0],
                        backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                        borderColor: documentStyle.getPropertyValue('--primary-500'),
                        borderWidth: 1
                    },
                    {
                        label: 'Chiffre d\'affaires par mois de l\'année ' + yearsToFetch[1],
                        data: data[1],
                        backgroundColor: documentStyle.getPropertyValue('--primary-200'),
                        borderColor: documentStyle.getPropertyValue('--primary-200'),
                        borderWidth: 1
                    }
                ]
            };
            // Assurez-vous d'adapter les options du graphique en fonction de vos besoins
            this.barOptions = {
                plugins: {
                    legend: {
                        labels: {
                            fontColor: textColor
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: textColorSecondary,
                            font: {
                                weight: 500
                            }
                        },
                        grid: {
                            display: false,
                            drawBorder: false
                        }
                    },
                    y: {
                        ticks: {
                            color: textColorSecondary
                        },
                        grid: {
                            color: surfaceBorder,
                            drawBorder: false
                        }
                    },
                }
            };
        }).catch(error => {
            console.error('Une erreur est survenue lors de la récupération des données : ', error);
        });
    }
    loadBarChartDataByWeek() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
        const yearToFetch = 2023; // Année pour laquelle vous souhaitez récupérer les données
    
        const weeksInYear = 52; // Nombre de semaines dans une année (peut varier selon le système)
        const dataPromise = Promise.all(
            Array.from({ length: weeksInYear }, (_, i) =>
                this.factureService.calculateCAByWeekAndYear(i + 1, yearToFetch).toPromise()
            )
        );
    
        dataPromise.then(data => {
            this.barDataCW = {
                labels: Array.from({ length: 52 }, (_, i) => i + 1), // Labels pour les semaines
                datasets: [
                    {
                        label: 'Chiffre d\'affaires par semaine de l\'année ' + yearToFetch,
                        data: data,
                        backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                        borderColor: documentStyle.getPropertyValue('--primary-500'),
                        borderWidth: 1
                    }
                ]
            };
            // Assurez-vous d'adapter les options du graphique en fonction de vos besoins
            this.barOptionsCW = {
                plugins: {
                    legend: {
                        labels: {
                            fontColor: textColor
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: textColorSecondary,
                            font: {
                                weight: 500
                            }
                        },
                        grid: {
                            display: false,
                            drawBorder: false
                        }
                    },
                    y: {
                        ticks: {
                            color: textColorSecondary
                        },
                        grid: {
                            color: surfaceBorder,
                            drawBorder: false
                        }
                    }
                }
            };
        }).catch(error => {
            console.error('Une erreur est survenue lors de la récupération des données : ', error);
        });
    }
    



    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
