import React, { Component, createRef } from 'react'
import { connect } from 'react-redux'
import '../../style/home.less'
import { Card, message } from 'antd'
import { dateFormat } from '../../util'
import axios from 'axios'
import { getPaidApi } from '../../apis/userApi' 
import echarts from 'echarts'

 const mapStateToProps = (state) => {
  return {
    userInfo: state.common.userInfo,
  }
}



@connect(mapStateToProps)
class Home extends Component {

  state = {
    date: '',
    payData: [],
    weather: '',
    barNode: createRef(),
    barChart: null,
    pieNode: createRef(),
    pieChart: null,
    lineNode: createRef(),
    lineChart: null,
    socket: null,
    result: {}
  }

  async componentDidMount () {

    this.getWeather()

    this.setState({
      date: dateFormat('yyyy年MM月dd日'),
      barChart: echarts.init(this.state.barNode.current),
      lineChart: echarts.init(this.state.lineNode.current),
      pieChart: echarts.init(this.state.pieNode.current),
    }, () => {
        setTimeout(() => {
            this.resizeChart()
            
            this.barChart()
            this.getLoopData()
            this.lineChart()
        }, 300);
    })




    // let result = await getPaidApi()
    // if(result.code === 200) {
    //   message.error('获取收付款信息成功！')
    //   setTimeout(() => {
          
    //   }, 200);
    //   this.state.barChart = echarts.init(this.state.barNode.current)
    //   this.barChart(result)
    // }

  


    window.addEventListener('resize', this.resizeChart)

  }

  componentWillUnmount () {
      window.removeEventListener('resize', this.resizeChart)
      if(this.state.barChart) this.state.barChart.dispose()
      if(this.state.pieChart) this.state.pieChart.dispose()
      if(this.state.lineChart) this.state.lineChart.dispose()
      if(this.state.socket) this.state.socket.close()
  }

  


  resizeChart = () => {
      if(this.state.barChart) this.state.barChart.resize()
      if(this.state.pieChart) this.state.pieChart.resize()
      if(this.state.lineChart) this.state.lineChart.resize()
  }

  async getWeather () {
    let res = await axios.get('https://devapi.heweather.net/v7/weather/now?location=101270101&key=8df82472137d4e7f95b18693a86bec41')
    if(res.data.code !== '200') {
      message.error('获取天气信息失败！')
      return
    }
    this.setState({
      weather: `天气：${res.data.now.text}, 温度：${res.data.now.temp}, 风向：${res.data.now.windDir}`
    })
  }

  async getLoopData () {
    let socket = window.io('http://www.shuiyue.info:12300')

    socket.on('connect', data => {
      socket.emit('clientEvt', { type: 'getTodayHot' })
    })

    socket.on('serverEvt', data => {
      // this.setState({
      //   payData: [...data]
      // })
      this.pieChart(data)
    })

    socket.on('error', () => {
      console.log('webSocket连接失败！')
    })

    this.setState({socket})

  }


  async barChart () {
    
    let result = await getPaidApi()
    if(result.code !== 200) {
      message.error('获取收付款信息失败！')
      return
    }

    let label = [],
        color = [['#A35AE0', '#6830E7'], ['#66FF66', '#00CA98'], ['#0CEBEA', '#368BFF']],
        names = ['已收', '应收', '合计'],
        data = [[], [], []],
        series = []
    
    for(let item of result.data) {
      label.push(item.date)
      data[0].push(item.received)
      data[1].push(item.receiving)
      data[2].push(item.total)

    }

    for (let i = 0; i < data.length; i++) {
      series.push({
        name: names[i],
        type: 'bar',
        barWidth: '15%',
        itemStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: color[i][0]
                }, {
                    offset: 1,
                    color: color[i][1]
                }]),
                barBorderRadius: 11,
            }
        },
        data: data[i]
      })
    }

    
    var xData = label;
    var option = {
        // backgroundColor: '#060B1C',
        tooltip: {
            trigger: 'axis',
            // backgroundColor: 'none',
            padding: 5,
          
        },
        grid: {
            left: '10%',
            top: '8%',
            right: '5%',
            bottom: '19%',
        },
        legend: {
          data: names,
          itemWidth: 12,
          itemHeight: 10,
          color: '#242424'
        },
        xAxis: [{
            type: 'category',
            data: xData,
            axisLabel: {
                show: true,
                // rotate: 20,
                fontSize: 9,
                textStyle: {
                    // color: "#C9C8CD" //X轴文字颜色
                },
                formatter: function(value) {
                    var str = "";
                    str += value.substring(0, 4) + "\n";
                    str += value.substring(5, 10);
                    return str;
                }
            },
            axisLine: {
                show: false //不显示x轴
            },
            axisTick: {
                show: false //不显示刻度
            },
            // boundaryGap: false,
            splitLine: {
                show: true,
                width: 0.08,
                lineStyle: {
                    type: "solid",
                    color: "#03202E"
                }
            },
            axisPointer: { //轴指示器
                type: 'shadow',
                z: 1,
                shadowStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0,
                            color: 'rgba(18,155,249,0)' // 0% 处的颜色
                        }, {
                            offset: 1,
                            color: 'rgba(18,155,249,1)' // 100% 处的颜色
                        }],
                        global: false // 缺省为 false
                    },
                    shadowColor: 'rgba(0, 0, 0, 0.2)',
                    shadowBlur: 5
                }
            },
    
        }],
        yAxis: [{
            type: 'value',
            // scale: true, //坐标轴起点不限制0
            axisLabel: {
                show: true,
                textStyle: {
                    fontSize: 9,
                    // color: "#C9C8CD" //X轴文字颜色
                }
            },
            splitLine: {
                show: false,
    
            },
            axisTick: {
                show: false, //不显示刻度
            },
            axisLine: {
                show: false,
            },
            nameTextStyle: {
                color: "#FFFFFF"
            },
            splitArea: {
                show: false
            }
        }],
        series
    };

    this.state.barChart.setOption(option)
  }

  async pieChart(_data) {
    var img = 'data:image/png;base64,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';

    var trafficWay = [{
        name: _data[1].name,
        value: _data[1].amount
    },{
        name: _data[2].name,
        value: _data[2].amount
    },{
      name: _data[4].name,
      value: _data[4].amount
    },{
      name: _data[5].name,
      value: _data[5].amount
    }];

    var data = [];
    var color=['#00ffff','#00cfff','#006ced','#ffe000','#ffa800','#ff5b00','#ff3000']
    for (var i = 0; i < trafficWay.length; i++) {
        data.push({
            value: trafficWay[i].value,
            name: trafficWay[i].name,
            itemStyle: {
                normal: {
                    borderWidth: 5,
                    shadowBlur: 20,
                    borderColor:color[i],
                    shadowColor: color[i]
                }
            }
        }, {
            value: 5000,
            name: '',
            itemStyle: {
                normal: {
                    label: {
                        show: false
                        
                    },
                    labelLine: {
                        show: false
                    },
                    color: 'rgba(0, 0, 0, 0)',
                    borderColor: 'rgba(0, 0, 0, 0)',
                    borderWidth: 0
                }
    }
        });
    }
    var seriesOption = [{
        name: '',
        type: 'pie',
        clockWise: false,
        radius: [105, 109],
        hoverAnimation: false,
        itemStyle: {
            normal: {
                label: {
                    show: true,
                    position: 'outside',
                    formatter: function(params) {
                      var percent = 0;
                      var total = 0;
                      for (var i = 0; i < trafficWay.length; i++) {
                          total += trafficWay[i].value * 1;
                      }
                      console.log(total)
                      percent = ((params.value * 1 / total) * 100).toFixed(0);
                      if(params.name !== '') {
                          return params.name + '\n' + '\n' + '占比' + percent + '%';
                      }else {
                          return '';
                      }
                  },
                },
                labelLine: {
                    length:5,
                    length2:10,
                    show: true,
                    // color:'#00ffff'
                }
            }
        },
        data: data
    }];
    let option = {
        // backgroundColor: '#0A2E5D',
        color : color,
        title: {
            text: '应收/付款',
            top: '48%',
            textAlign: "center",
            left: "49%",
            textStyle: {
                color: '#006ced',
                fontSize: 22,
                fontWeight: '400'
            }
        },
        graphic: {
        elements: [{
            type: "image",
            z: 3,
            style: {
                image: img,
                width: 178,
                height: 178
            },
            left: 'center',
            top:  'center',
            position: [100, 100]
        }]
        },
        tooltip: {
            show: false
        },
        legend: {
            icon: "circle",
            orient: 'horizontal',
            // x: 'left',
            data:['已收款','未收款','已付款','未付款'],
            itemGap: 20
        },
        toolbox: {
            show: false
        },
        series: seriesOption
    }
    this.state.pieChart.setOption(option)
  }


  async lineChart() {

    let result = await getPaidApi()
    if(result.code !== 200) {
      message.error('获取收付款信息失败！')
      return
    }

    let label = [],
        color = [['#A35AE0', '#6830E7'], ['#66FF66', '#00CA98'], ['#0CEBEA', '#368BFF']],
        names = ['已收', '应收', '合计'],
        data = [[], [], []],
        series = []

    for(let item of result.data) {
        label.push(item.date)
        data[0].push(item.received)
        data[1].push(item.receiving)
        data[2].push(item.total)
    
    }

    for(let i = 0; i < data.length; i++) {
        series.push(
            {
                name: names[i],
                type: 'line',
                data: data[i],
                symbolSize: 1,
                symbol: 'circle',
                smooth: true,
                yAxisIndex: 0,
                showSymbol: false,
                lineStyle: {
                    width: 5,
                    color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                            offset: 0,
                            color: color[i][0]
                        },
                        {
                            offset: 1,
                            color: color[i][1]
                        }
                    ]),
                    shadowColor: 'rgba(158,135,255, 0.3)',
                    shadowBlur: 10,
                    shadowOffsetY: 20
                },
            }
        )
    }


    const xData = label
    let option = {
        backgroundColor: '#fff',
        title: {
            textStyle: {
                fontSize: 12,
                fontWeight: 400
            },
            left: 'center',
            top: '5%'
        },
        legend: {
            data: names,
            icon: 'circle',
            top: '5%',
            itemWidth: 6,
            itemGap: 20,
            textStyle: {
                color: '#556677'
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                label: {
                    show: true,
                    backgroundColor: '#fff',
                    color: '#556677',
                    borderColor: 'rgba(0,0,0,0)',
                    shadowColor: 'rgba(0,0,0,0)',
                    shadowOffsetY: 0
                },
                lineStyle: {
                    width: 0
                }
            },
            backgroundColor: '#fff',
            textStyle: {
                color: '#5c6c7c'
            },
            padding: [10, 10],
            extraCssText: 'box-shadow: 1px 0 2px 0 rgba(163,163,163,0.5)'
        },
        grid: {
            top: '15%'
        },
        xAxis: [{
            type: 'category',
            data: xData,
            axisLine: {
                lineStyle: {
                    color: 'rgba(107,107,107,0.37)', //x轴颜色
                }
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                interval: 0,
                textStyle: {
                    color: '#999' //坐标轴字颜色
                },
                margin: 15,
                rotate: 20
            },
            axisPointer: {
                label: {
                    padding: [11, 5, 7],
                    backgroundColor: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0,
                            color: '#fff' // 0% 处的颜色
                        }, {
                            offset: 0.9,
                            color: '#fff' // 0% 处的颜色
                        }, {
                            offset: 0.9,
                            color: '#33c0cd' // 0% 处的颜色
                        }, {
                            offset: 1,
                            color: '#33c0cd' // 100% 处的颜色
                        }],
                        global: false // 缺省为 false
                    }
                }
            },
            boundaryGap: false
        }],
        yAxis: [{
            type: 'value',
            axisTick: {
                show: false
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: 'rgba(107,107,107,0.37)', //y轴颜色
                }
            },
            axisLabel: {
                textStyle: {
                    color: '#999'
                }
            },
            splitLine: {
                show: false
            }
        }],
        series
    };
    this.state.lineChart.setOption(option)

  }


  render() {
    console.log(this.props)
    return (
      <div className='home-page-container'>
        <div className='line'>
          <div className='left'>
            <Card style={{ width: '100%' }}>
              <p>{this.props.userInfo.name} --- {this.props.userInfo.duties}</p>
              <p>您好，欢迎登录贸易跟单系统</p>
              <p>今天是：{this.state.date}</p>
              <p>{this.state.weather}</p>
            </Card>
          </div>
          <div>
            <Card style={{ width: '100%' }}>
              <div ref={this.state.barNode} style={{ height: '100%' }}> </div>
            </Card>
          </div>
        </div>
        <div className='line'>
          <div className='left'>
            <Card style={{ width: '100%' }}>
              <div ref={this.state.pieNode} style={{ height: '100%' }}></div>
            </Card>
          </div>
          <div>
            <Card style={{ width: '100%' }}>
              <div ref={this.state.lineNode} style={{ height: '100%' }}></div>
            </Card>
          </div>
        </div>
      </div>
    )
    
  }
}

export default Home