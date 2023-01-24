import * as d3 from 'd3';
import dayjs, { Dayjs } from 'dayjs';

export class Line {
  private svg;

  // 縦の区割り
  private xScale;

  private xAxis;

  private yScale;

  private lineArea;

  private lineNode;

  data = [
    { date: dayjs('2023-01-01T00:00:00+09:00'), value: 0 },
    { date: dayjs('2023-01-01T01:00:00+09:00'), value: 1 },
    { date: dayjs('2023-01-01T02:00:00+09:00'), value: null },
    { date: dayjs('2023-01-01T03:00:00+09:00'), value: 0 },
    { date: dayjs('2023-01-01T03:30:00+09:00'), value: 0.5 },
    { date: dayjs('2023-01-01T04:00:00+09:00'), value: 0 },
    { date: dayjs('2023-01-01T05:00:00+09:00'), value: 1 },
  ];

  constructor(ref: HTMLDivElement) {
    // const X = d3.map(this.data, (d) => d.value);
    // console.log(X);
    // console.log(d3.range(X.length));
    // console.log(d3.extent(X));

    const a = d3.select(ref).selectAll('svg');

    a.each((_, i, array) => {
      const hoge = array[i];

      if (hoge instanceof Element) {
        hoge.remove();
      }
    });
    const start = dayjs('2023-01-01T00:00:00+09:00');
    const end = dayjs('2023-01-01T20:00:00+09:00');

    this.svg = d3
      .select(ref)
      .append('svg')
      .attr('viewBox', `0 0 300 80`)
      // .style('background-color', 'red')
      .on('pointerenter pointermove', (e) => {
        console.log(d3.pointer(e));
      })
      .append('g')
      .attr('transform', 'translate(10, 0)');

    this.genGradient();

    this.xScale = d3
      .scaleTime()
      .domain([start, end]) // 入力値の範囲 =
      .range([0, 280]); // 出力の範囲

    this.yScale = d3
      .scaleLinear()
      .domain([0, 1]) // 入力値の範囲 =
      .range([0, 30]); // 出力の範囲

    this.xAxis = d3
      .axisTop(this.xScale)
      .ticks(20) // メモリの線の数
      .tickPadding(5) // メモリとメモリ名との間
      .tickSize(30) // メモリの線の長さ
      .tickFormat((_, i) => {
        // console.log(a);

        return start.add(i, 'hour').format('HH'); // dayjs(a).format('HH');

        // return a;
      });

    // const formatTime = d3.timeFormat('%m/%d.%H');
    // console.log(formatTime(new Date()));

    this.svg
      .append('g')
      .classed('xScale', true)
      .call(this.xAxis)
      .attr('transform', `translate(0, 80)`);
    // .attr('fill', 'green');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const line = d3
      .line<{ date: Dayjs; value: number | null }>()
      .x((d) => this.xScale(d.date))
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
      .y((d) => this.yScale((d as any).value))
      .defined((d) => d.value !== null); // nullのデータがある場合はlineを消せる

    this.lineNode = this.svg
      .append('g')
      .attr('class', 'line')
      .append('path')
      .datum(this.data)
      .attr('fill', 'none')
      .attr('stroke', '#4aacb5')
      .attr('stroke-width', 3)
      .attr('d', line)
      .attr('transform', `translate(0, 50)`);

    this.lineArea = this.svg
      .append('g')
      .attr('class', 'linearGradientArea')
      .append('path');
    const area = d3
      .area<{ date: Dayjs; value: number | null }>()
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
      .x((d: any): any => this.xScale(d.date))
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
      .y1((d: any): any => this.yScale(d.value))
      .y0(this.yScale(0))
      .defined((d) => d.value !== null);
    // エリアを実際に描画
    this.lineArea
      .datum(this.data)
      .attr('d', area)
      .style('fill', 'url(#linear-gradient)')
      .attr('transform', `translate(0, 50)`);

    if (!this.lineNode) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const totalLength = this.lineNode.node().getTotalLength();
    this.lineNode
      .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .duration(1000)
      .ease(d3.easeCircleInOut)
      .attr('stroke-dashoffset', 0);

    this.lineArea
      .style('opacity', 0)
      .transition()
      .delay(500)
      .duration(300)
      .ease(d3.easeCircleOut)
      .style('opacity', 1);

    /**
     * 改行のため、一度textを削除してtspanで改行を追加する
     */
    const texts = this.svg.selectAll('.tick text');
    texts.each((_, i, array) => {
      const textElement = d3.select(array[i]);
      const text = textElement.text();
      textElement.text('');
      // メモリの表記抜く
      if (Number(text) % 2) {
        return;
      }
      textElement.append('tspan').text('a').attr('x', 0).attr('dy', '-15');
      textElement.append('tspan').text(text).attr('x', 0).attr('dy', '15');
    });
  }

  genGradient() {
    const linearGradient = this.svg
      .append('defs')
      .append('linearGradient')
      .attr('id', 'linear-gradient')
      .attr('gradientTransform', 'rotate(90)');
    // 予約にグラデ設定を追加
    linearGradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', 'rgba(72, 146, 146, 0.6)');
    linearGradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', 'rgba(0,0,0,0)');
  }
}
