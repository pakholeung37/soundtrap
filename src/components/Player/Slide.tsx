import React, { Component, MouseEventHandler, EventHandler } from 'react'

type Props = {
  precentage?: number;
  className?: string;
  onChange?: (value: number) => void;
}

export default class Slide extends Component<Props> {
  
  private rootRef = React.createRef<HTMLDivElement>();
  private actionTriggerd = false;

  static defaultProps = {
    precentage: 0,
  }
  /**
   *当handle被按下是，在文档根元素加入两个监听器和处理器，用于监听之后的mousemove 和 mouseup 动作
   *
   * @type {MouseEventHandler}
   * @memberof Slide
   */
  handleMouseDown: MouseEventHandler = (event) => {
    this.actionTriggerd = true;
  }
  /**
   *这是一个native handler 所以在定义时要与React混合事件处理器 MouseEventHandler 区分
   *
   * @memberof Slide
   */
  handleMouseMove = (event: MouseEvent) => {
    if(!this.actionTriggerd) return;
    const { clientX } = event;
    const refDom = this.rootRef.current;
    if(!refDom) {
      console.warn('slider root ref not exist');
      return;
    }
    requestAnimationFrame(() => {
      const newPresentage = Math.min(
        Math.max((clientX - refDom.offsetLeft) / refDom.offsetWidth * 100, 0)
        , 100);
      this.onChange(newPresentage);
    })
  }
  /**
   *注册到根元素的两个处理器，当鼠标释放后直接释放这两个处理器
   *
   * @memberof Slide
   */
  handleMouseUp = (event: MouseEvent) => {
    this.actionTriggerd = false;
  }
  onChange = (newPresentage: number) => {
    this.props.onChange && this.props.onChange(newPresentage);
    return;
  }

  componentDidMount() {
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
  }

  render() {
    const { precentage, className } = this.props
    return (
      <div className={ `slider ${className || '' }` }
        ref={this.rootRef}
        role="button">
        <div className="slider__range"></div>
        <div className="slider__range slider__range--precentage" style={{
          width: `${precentage}%`,
        }}></div>
        <div className="slider__handle" style={{
          left: `${precentage}%`
        }}
          onMouseDown={ this.handleMouseDown }
          onClick= {prevent}
          ></div>
      </div>
    )
  }
}

const prevent: MouseEventHandler = (e) => {
  e.preventDefault();
  e.stopPropagation();
}