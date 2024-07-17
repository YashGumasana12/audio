//#region import 
//#region RN
import React, { Component } from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
//#endregion
//#region third party libs
import AutoHeightImage from 'react-native-auto-height-image';
import SoundPlayer from 'react-native-sound-player';
//#endregion
//#region redux
import * as actions from "../../redux/actions/courseActions";
//#endregion
//#region common files
import Util from '../../utils/utils';
import globalStyles from '../../res/globalStyles';
import { DEVICE_OS, wp } from '../../utils/constants';
import { images } from '../../res/images';
import { colors } from '../../res/colors';
//#endregion
//#endregion

class Metronome extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isPlaying: this.props.clearAudio || false,
            isPause: false,
            count: 0,
            bpm: Number(this.props.currentBpm) || 80,
            beatsPerMeasure: 4,
            bpmData: [
                { icon: images.grayLessFive, isTapped: false, type: 'LF' },
                // { icon: images.grayLessOne, isTapped: false, type: 'LO' },
                // { icon: images.greenMoreOne, isTapped: false, type: 'MO' },
                { icon: images.greenMoreFive, isTapped: false, type: 'MF' },
            ],
            isDoneBtnClicked: false
        };
        this._onFinishedPlayingSubscription = null;
    }

    componentDidMount() {
        this._onFinishedPlayingSubscription = SoundPlayer.addEventListener('FinishedPlaying', ({ success }) => {            
            if (this.state.isPlaying) {
                try {
                    SoundPlayer.playSoundFile(`m_${this.state.bpm}`, 'mp3');
                    SoundPlayer.setMixAudio(true);
                } catch (e) {
                    console.log(`cannot play the sound file`, e)
                }
            }
        })
    }
    componentWillUnmount() {
        this._onFinishedPlayingSubscription.remove();
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.clearAudio) {
            this.stop();
        }
    }

    // playClick = () => {
    //     const { count, beatsPerMeasure } = this.state;

    //     console.log("count % beatsPerMeasure ", count % beatsPerMeasure);
    //     // alternate click sounds
    //     if (count % beatsPerMeasure === 0) {
    //         // this.click2.play();
    //         try {
    //             SoundPlayer.playSoundFile('lowqualityl', 'mp3');
    //         } catch (e) {
    //             console.log(`cannot play the sound file`, e)
    //         }
    //     } else {
    //         // this.click1.play();            
    //         try {
    //             SoundPlayer.playSoundFile('lowqualityfh', 'mp3');
    //         } catch (e) {
    //             console.log(`cannot play the sound file`, e)
    //         }
    //     }

    //     // keep track of which beat we're on
    //     this.setState(state => ({
    //         count: (state.count + 1) % state.beatsPerMeasure
    //     }));
    // };

    startStop = () => {
        if (this.state.isPlaying) {
            this.setState({ isPlaying: false, isPause: false });
            SoundPlayer.stop();
        } else {
            try {
                SoundPlayer.playSoundFile(`m_${this.state.bpm}`, 'mp3');
                SoundPlayer.setMixAudio(true);
            } catch (e) {
                console.log(`cannot play the sound file`, e)
            }
            this.setState({ isPlaying: true, isPause: true });
        }

        // if (this.state.isPlaying) {
        //     // stop the timer
        //     clearInterval(this.timer);
        //     this.setState({
        //         isPlaying: false,
        //         isPause: false
        //     });
        // } else {
        //     // start a timer with current bpm
        //     this.timer = setInterval(this.playClick, (60 / this.state.bpm) * 1000);
        //     this.setState(
        //         {
        //             count: 0,
        //             isPlaying: true,
        //             isPause: true
        //             // play a click immediately (after setState finishes)
        //         },
        //         // this.playClick
        //     );
        // }
    };

    stop = (flag) => {
        clearInterval(this.timer);
        this.setState({ isPlaying: false, isPause: flag ? true : false });
        SoundPlayer.stop();
    }

    render() {
        const { isPlaying, bpm } = this.state;

        return (
            <View style={{ ...globalStyles.flex, justifyContent: 'center', ...this.props.style }}>
                <AutoHeightImage width={wp(90)} source={images.bpmBackground}>
                    <View style={styles.bpmMainContainer}>
                        <View style={styles.bpmContainer}>
                            {this.state.bpmData.map((item, index) => {
                                return (
                                    <TouchableOpacity disabled={this.state.isDoneBtnClicked} onPress={() => {
                                        // setMetronomeTimeout(true);                                    
                                        // !item.isTapped && (item.isTapped = true);
                                        if (item.type === 'LF' || item.type === 'LO') {
                                            if ((bpm - (item.type === 'LF' ? 5 : 1)) >= 40) {
                                                isPlaying && this.stop(true);
                                                this.setState({
                                                    bpm: bpm - (item.type === 'LF' ? 5 : 1),
                                                    isDoneBtnClicked: true
                                                });
                                                // setCurrentBpm(currentBpm - (item.type === 'LF' ? 5 : 1));
                                                this.props.isLessons ?
                                                    this.props.dispatch(actions.onChapterUpdateBpm(this.props.authReducers.userDetails, this.props.courseReducers, this.props.currentSlider, bpm - (item.type === 'LF' ? 5 : 1))) :
                                                    this.props.dispatch(actions.onUpdateBpm(this.props.authReducers.userDetails, this.props.courseReducers, this.props.courseReducers.selectedPatternItem, bpm - (item.type === 'LF' ? 5 : 1)));

                                                setTimeout(() => {
                                                    if (this.state.isPause) {
                                                        this.startStop();
                                                        this.props.setClearAudio(false);
                                                    }
                                                    this.setState({ isDoneBtnClicked: false });
                                                }, 300);

                                            }
                                        } else if (item.type === 'MF' || item.type === 'MO') {                                            
                                            if ((bpm + (item.type === 'MF' ? 5 : 1)) <= 250) {
                                                isPlaying && this.stop(true);
                                                this.setState({
                                                    bpm: bpm + (item.type === 'MF' ? 5 : 1),
                                                    isDoneBtnClicked: true
                                                });
                                                // setCurrentBpm(currentBpm + (item.type === 'MF' ? 5 : 1));
                                                this.props.isLessons ?
                                                    this.props.dispatch(actions.onChapterUpdateBpm(this.props.authReducers.userDetails, this.props.courseReducers, this.props.currentSlider, bpm + (item.type === 'MF' ? 5 : 1))) :
                                                    this.props.dispatch(actions.onUpdateBpm(this.props.authReducers.userDetails, this.props.courseReducers, this.props.courseReducers.selectedPatternItem, bpm + (item.type === 'MF' ? 5 : 1)));
                                                setTimeout(() => {
                                                    if (this.state.isPause) {
                                                        this.startStop();
                                                        this.props.setClearAudio(false);
                                                    }
                                                    this.setState({ isDoneBtnClicked: false });
                                                }, 300);
                                            }
                                        }
                                    }}>
                                        <AutoHeightImage width={wp(16)} source={item.icon} />
                                    </TouchableOpacity>
                                )
                            })}
                        </View>

                        <Text style={{ ...globalStyles.textHome, fontSize: wp(20), textAlign: 'center' }}>{this.state.bpm}<Text style={{ ...globalStyles.textHome, fontSize: wp(5), color: colors.grayDark, alignSelf: 'flex-end' }}>bpm</Text></Text>
                        <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => {
                            Util.onHapticFeedback();
                            this.startStop();
                            this.props.setClearAudio(false);
                        }}>
                            <AutoHeightImage width={wp(74)} source={!this.state.isPause ? images.play : images.pause} />
                        </TouchableOpacity>
                    </View>
                </AutoHeightImage>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    bpmMainContainer: {
        padding: wp(5),
        paddingTop: wp(6),
        paddingBottom: wp(6),
        flex: 1,
        justifyContent: 'space-between'
    },
    bpmContainer: {
        flexDirection: 'row',
        // justifyContent: 'space-evenly'
        justifyContent: 'space-between'
    }
});
export default Metronome;