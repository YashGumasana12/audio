//#region import
//#region RN
import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet} from 'react-native';
//#endregion
//#region third party libs
import {LineChart} from 'react-native-chart-kit';
//#endregion
//#region redux
import {useSelector, useDispatch} from 'react-redux';
//#endregion
//#region common files
import globalStyles from '../res/globalStyles';
import {fonts} from '../res/fonts';
import {colors} from '../res/colors';
import {wp} from '../utils/constants';
import {Spacer} from '../res/spacer';
//#endregion
//#endregion

export const TrainingGraph = props => {
  //#region redux
  const dispatch = useDispatch();
  const courseReducers = useSelector(state => state.courseReducers);
  //#endregion redux
  //#region local state
  const [graphScores, setGraphScores] = useState([
    {title: '1st score', score: '0'},
    {title: 'Last score', score: '0'},
  ]);
  const [update, setUpdate] = useState(0);
  //#endregion
  //#region local function
  useEffect(() => {
    if (courseReducers?.earScoreGraph?.scores?.length !== 0) {
      graphScores[0].score = courseReducers?.earScoreGraph?.scores[0].avg_time;
      graphScores[1].score =
        courseReducers?.earScoreGraph?.scores[
          courseReducers?.earScoreGraph?.scores?.length - 1
        ].avg_time;
    }
    setUpdate(Math.floor(Math.random() * 100) + 1);
  }, [courseReducers.earScoreGraph]);
  //#endregion
  //#region consts
  const chartConfig = {
    backgroundGradientFrom: colors.blackBase6,
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: colors.blackBase6,
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => colors.redBase1,
    barPercentage: 0.5,
    propsForDots: {r: wp(0.7)},
  };
  const data = {
    // labels: ["January", "February", "March"],
    datasets: [
      {
        data: courseReducers?.earScoreGraph?.graphData,
        // data: [10, 0, 55, 13, 14, 100, 1, 15, 60, 0, 10, 0, 55, 13, 14, 100, 1, 15, 60, 0, 10, 0, 55, 13, 14, 100, 1, 15, 60, 0],
        color: (opacity = 1) => colors.creamBase3,
        strokeWidth: wp(1.5),
      },
    ],
  };
  //#endregion
  return (
    <View style={styles.mainContainer}>
      <Text style={{...globalStyles.textHome, ...styles.progressTxt}}>
        Your progress
      </Text>
      <View style={{...globalStyles.row, width: wp(70)}}>
        {graphScores.map((item, i) => {
          return (
            <View style={styles.graphsScoreContainer}>
              <Text style={{...globalStyles.textHome, ...styles.titleTxt}}>
                {item.title}
              </Text>
              <Text
                style={[
                  {...globalStyles.textHome, ...styles.scoreTxt},
                  i === 1 && {textAlign: 'right'},
                ]}>
                {item.score}
              </Text>
            </View>
          );
        })}
      </View>
      <Spacer space={wp(2.5)} />
      <View style={styles.graphContainer}>
        <Text style={{...globalStyles.textHome, ...styles.verticalTxt}}>
          scores
        </Text>
        <LineChart
          data={data}
          width={wp(82)}
          height={wp(40)}
          style={styles.lineChartStyle}
          withShadow={false}
          withInnerLines={false}
          withOuterLines={false}
          withVerticalLabels={false}
          withHorizontalLabels={false}
          chartConfig={chartConfig}
        />
        <View style={{...styles.graphBorder, height: wp(40)}} />
        <View style={{...styles.graphBorder, width: wp(70), bottom: 0}} />
      </View>
      <Spacer space={wp(1)} />
      <Text style={{...globalStyles.textHome, ...styles.timeTxt}}>time</Text>
      {courseReducers?.earScoreGraph?.scores.length > 1 &&
        courseReducers?.earScoreGraph?.scoreDifference > 0 && (
          <>
            <Spacer space={wp(3)} />
            <Text style={{...globalStyles.textHome, ...styles.xTxt}}>
              Your ear is now{' '}
              <Text style={{color: colors.creamBase3, fontFamily: fonts.QE}}>
                {courseReducers?.earScoreGraph?.scoreDifference
                  .toString()
                  .match(/^\d+(?:\.\d{0,2})?/)}
                x
              </Text>{' '}
              better{`\n`}than when you started !
            </Text>
          </>
        )}
      <Spacer space={wp(3)} />
    </View>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    borderRadius: wp(4),
    backgroundColor: colors.blackBase6,
    width: wp(90),
    alignItems: 'center',
    overflow: 'hidden',
    marginTop: wp(10),
    marginBottom: wp(8),
    alignSelf: 'center',
  },
  progressTxt: {
    fontSize: wp(4.5),
    fontFamily: fonts.FM,
    color: colors.gray2,
    padding: wp(8),
    paddingBottom: wp(5),
  },
  graphsScoreContainer: {
    borderRadius: wp(2.5),
    backgroundColor: colors.blackBase7,
    padding: wp(2),
    paddingVertical: wp(1.5),
  },
  titleTxt: {
    fontFamily: fonts.QE,
    color: colors.gray2,
  },
  scoreTxt: {
    fontFamily: fonts.FM,
    color: colors.grayDark3,
  },
  graphContainer: {
    width: wp(70),
    height: wp(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
  verticalTxt: {
    fontFamily: fonts.FM,
    color: colors.grayDark,
    transform: [{rotate: '-90deg'}],
    position: 'absolute',
    left: -wp(10),
  },
  lineChartStyle: {
    marginBottom: -wp(4.5),
    marginLeft: -wp(12),
  },
  graphBorder: {
    padding: wp(0.7),
    backgroundColor: colors.blackBase8,
    borderRadius: wp(2),
    position: 'absolute',
    left: 0,
  },
  timeTxt: {
    fontFamily: fonts.FM,
    color: colors.grayDark,
  },
  xTxt: {
    fontSize: wp(4.5),
    fontFamily: fonts.FM,
    color: colors.gray2,
    textAlign: 'center',
  },
});
