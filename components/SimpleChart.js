import dynamic from 'next/dynamic'
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })
import React, { Component } from "react";

class SimpleChart extends Component {
    constructor(props) {
        super(props);
        const categories = props.series.length ? Array.from({ length: props.series[0].data.length }, (_, i) => i + 1) : []
        this.state = {
            options: {
                chart: {
                    id: props.id,
                    animations: {
                        speed: 350,
                        animateGradually: {
                            delay: 35
                        }
                    }
                },
                title: {
                    text: props.title
                },
                colors: ['#2E93fA', '#66DA26', '#546E7A', '#E91E63', '#FF9800', '#546E7A', '#A300D6', '#C7F464',
                    '#F86624', '#2E294E', '#D4526E', '#C4BBAF', '#7D02EB', '#8D5B4C', '#4CAF50'],
                xaxis: {
                    categories: categories
                }
            },
            series: props.series
        }
    }
    render() {
        return (
            <Chart options={this.state.options} series={this.state.series} type="line" width="100%" height={450} />
        )
    }
}

export default SimpleChart;
