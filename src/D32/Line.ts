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
    { date: dayjs('2023-01-01T03:00:00+09:00'), value: 0 },
    { date: dayjs('2023-01-01T04:00:00+09:00'), value: 1 },
    { date: dayjs('2023-01-01T05:00:00+09:00'), value: null },
    { date: dayjs('2023-01-01T06:00:00+09:00'), value: 1 },
    { date: dayjs('2023-01-01T07:30:00+09:00'), value: 0.5 },
    { date: dayjs('2023-01-01T08:00:00+09:00'), value: 0 },
    { date: dayjs('2023-01-01T09:00:00+09:00'), value: 1 },
    { date: dayjs('2023-01-01T09:15:00+09:00'), value: 0.5 },
    { date: dayjs('2023-01-01T09:30:00+09:00'), value: 0.2 },
    { date: dayjs('2023-01-01T09:45:00+09:00'), value: 0.8 },
    { date: dayjs('2023-01-01T10:00:00+09:00'), value: 0 },
    { date: dayjs('2023-01-01T10:15:00+09:00'), value: 0.7 },
    { date: dayjs('2023-01-01T10:30:00+09:00'), value: 0.2 },
    { date: dayjs('2023-01-01T10:45:00+09:00'), value: null },
    { date: dayjs('2023-01-01T11:00:00+09:00'), value: 0.8 },
    { date: dayjs('2023-01-01T11:15:00+09:00'), value: 1 },
    { date: dayjs('2023-01-01T11:30:00+09:00'), value: 0.2 },
    { date: dayjs('2023-01-01T12:00:00+09:00'), value: 0.7 },
  ];

  constructor(ref: HTMLDivElement) {
    const a = d3.select(ref).selectAll('svg');

    a.each((_, i, array) => {
      const hoge = array[i];

      if (hoge instanceof Element) {
        hoge.remove();
      }
    });
    const start = dayjs('2023-01-01T03:00:00+09:00');
    const end = dayjs('2023-01-01T23:00:00+09:00');

    this.svg = d3
      .select(ref)
      .append('svg')
      .attr('width', '600px')
      .attr('height', '200px')
      .attr('viewBox', `0 0 600 200`)
      .on('pointerenter pointermove', (e) => {
        console.log(d3.pointer(e));
      })
      // .style('background-color', 'red')
      .append('g')
      .attr('transform', 'translate(10, 0)');

    this.xScale = d3
      .scaleTime()
      .domain([start, end]) // 入力値の範囲 =
      // .domain([0, 20]) // 20時間分
      .range([0, 580]); // 出力の範囲

    this.xAxis = d3
      .axisTop<Date>(this.xScale)
      .ticks(20) // メモリの線の数
      .tickPadding(5) // メモリとメモリ名との間
      .tickSize(60) // メモリの線の長さ
      .tickFormat((_date) => {
        return dayjs(_date).format('HH');
      });

    this.yScale = d3
      .scaleLinear()
      .domain([1, 0]) // 入力値の範囲 =
      .range([0, 60]); // 出力の範囲 メモリの線の長さと合わす

    this.genGradient();

    this.svg
      .append('g')
      .classed('xScale', true)
      .call(this.xAxis)
      .attr('transform', `translate(0, 100)`);

    const line = d3
      .line<{ date: Dayjs; value: number | null }>()
      .defined((d) => d.value !== null) // nullのデータがある場合はlineを消せる
      .x((d) => this.xScale(d.date))
      .y((d) => {
        if (d.value) {
          return this.yScale(d.value);
        }

        return this.yScale(0);
      });

    console.log(this.xScale(dayjs('2023-01-01T10:30:00+09:00')));

    const xScaleSize = this.svg.select('.domain').node();
    if (xScaleSize instanceof Element) {
      const b = xScaleSize.getBoundingClientRect();
      // clip 重なってる部分が見える
      const clip = this.svg
        .append('clipPath')
        .attr('id', 'hoge')
        .append('rect')
        .attr('width', 0)
        .attr('height', b.height)
        .attr('transform', `translate(0, 0)`);

      clip
        .transition()
        .duration(1000)
        .ease(d3.easeCircleInOut)
        .attr('width', b.width);

      this.lineNode = this.svg
        .append('g')
        .attr('class', 'line')
        .append('path')
        .attr('clip-path', 'url(#hoge)')
        .datum(this.data)
        .attr('fill', 'none')
        .attr('stroke', '#4aacb5')
        .attr('stroke-width', 3)
        .attr('d', line)
        .attr('transform', `translate(0, 40)`); // yScaleのtranslate: 100 - range:60

      const area = d3
        .area<{ date: Dayjs; value: number | null }>()
        .defined((d) => d.value !== null)
        .x((d) => this.xScale(d.date))
        .y1((d) => {
          if (d.value) {
            return this.yScale(d.value);
          }

          return this.yScale(0);
        })
        .y0(this.yScale(0));

      this.lineArea = this.svg
        .append('g')
        .attr('class', 'linearGradientArea')
        .append('path')
        .attr('clip-path', 'url(#hoge)');

      // エリアを実際に描画
      this.lineArea
        .datum(this.data)
        .attr('d', area)
        .style('fill', 'url(#linear-gradient)')
        .attr('transform', `translate(0, 40)`);
    }

    /**
     * ストロークを破線にする
     * グラフの幅分のでかい隙間の破線にする
     * 実践ぶんずらす
     * 隙間の間隔をジョジョに0にしてアニメーションを再現する
     */
    // this.lineNode
    //   .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
    //   .attr('stroke-dashoffset', totalLength)
    //   .transition()
    //   .duration(1000)
    //   .ease(d3.easeCircleInOut)
    //   .attr('stroke-dashoffset', 0);
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
