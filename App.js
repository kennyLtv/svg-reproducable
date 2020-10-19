/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {PanResponder, Animated, SafeAreaView} from 'react-native';
import {G, Rect, Text, TSpan, Svg} from 'react-native-svg';
const boxSize = 10;
const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedRect = Animated.createAnimatedComponent(Rect);
class App extends React.Component {
  constructor() {
    super()
    this.state = {
      ball: new Animated.ValueXY({
          x: 190,
          y: 90
      }),
      height: 100,
      width: 200,
      dx: 190,
      dy: 90
    } 
    this.resizeResponse = PanResponder.create({
      onPanResponderTerminationRequest: () => false,
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (e, gesture) => {
          if(e.nativeEvent.touches.length === 1){
              let {x, y} = this.state.ball.__getValue()
              let {width, height} = this.state;
              this.originalPlacement = {x,y,width,height}
              this.state.ball.setOffset({x, y});
              this.state.ball.setValue({ x: 0, y: 0 });
          }
      },
      onPanResponderMove: (e, gs) => {
          if(e.nativeEvent.touches.length === 1){
              Animated.event([
                  null,
                  {
                      dx: this.state.ball.x,
                      dy: this.state.ball.y,
                  }
              ], {
                  useNativeDriver: false
              })(e, gs);

              let {x, y} = this.state.ball.__getValue()

              // scale up to match the stored value, we'll scale down by the difference in scale at render time.
              // we calculate the change in size based on the current X/Y value less the original X Y placement when the drag was started.
              let changeX = x - this.originalPlacement.x
              let changeY = y - this.originalPlacement.y
              
              // add the difference in positions to the current width and height values.
              let finalX = Math.max(200, Math.round((this.originalPlacement.width + changeX)))
              let finalY = Math.max(100, Math.round((this.originalPlacement.height + changeY)))

              // this affects the placement of the square, we take the new height|width and multiply by the difference in scale then subtract the box size and adjust for zoom.
              let dy = ((finalY) - boxSize)
              let dx = ((finalX) - boxSize)
              this.setState({dx: Math.round(dx), dy: Math.round(dy), height: Math.round(finalY), width: Math.round(finalX)})
          }
      },
      onPanResponderRelease: (e, gs) => {
        this.state.ball.flattenOffset();
      }
  })
  }
  render() {
    let {width, height, dx,dy} = this.state;
    return <>
    <SafeAreaView>
      <Svg>
        <AnimatedG translateX={10} translateY={10} rotation={0} origin={`${width/2}, ${height/2}`}>
            <Text translateX={5} fontSize={6} fontWeight="bold" translateY={10} fill="black" textAnchor="start">
                <TSpan inlineSize={Math.max(10, this.state.width-10)}>Kevin ground round boudin chuck tri-tip short loin. Meatball prosciutto strip steak spare ribs leberkas pork venison rump shank pancetta hamburger t-bone ribeye. Pig chuck andouille, pork chop jowl corned beef cupim. Pork loin ball tip tail, bresaola bacon beef ribs cupim shoulder ham hock prosciutto turducken. Landjaeger t-bone tenderloin ham, tri-tip shank buffalo cow jerky boudin pig beef ribs.</TSpan>
            </Text>
            <Rect fill="transparent" stroke={"black"} strokeWidth={1} width={width} height={height}/>
            <AnimatedRect {...this.resizeResponse.panHandlers} fill="black" x={dx} y={dy} height={boxSize} width={boxSize}></AnimatedRect>
        </AnimatedG>
      </Svg>
    </SafeAreaView>
    </>
  }
};
export default App;
