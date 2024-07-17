
import {
    COURSES,
    ON_COURSE_ITEM_CLICKED,
    ON_PATTERN_ITEM_CLICKED,
    FAVORITES_PATTERNS,
    ON_UPDATE_TRAINING_TYPE,
    ON_UPDATE_TRAINING_TABS,
    SELECTED_LETTERS,
    ON_EAR_LEVEL,
    ON_UPDATE_EAR_TRAINING_TYPE,
    ON_UPDATE_EAR_TRAINING_TABS,
    ON_EAR_TRAINING_START,
    ON_EAR_TRAINING_CONGRATS,
    ON_EAR_TRAINING_DATA,
    ON_EAR_LETTER_SOUND,
    ON_CURRENT_NOTE_PLAYED,
    IS_CORRECT_NOTE,
    IS_NOTE_HIGHLIGHT,
    IS_NOTE_CLICKED,
    IS_CORRECT_HIGHLIGHT,
    CORRECT_ANS,
    EAR_CONGO_DETAILS,
    ON_EAR_AVG_REACT_TIME,
    IS_EAR_AVG_REACT_TIME,
    NO_OF_EAR_EXERCISE,
    MAJOR_MINOR_RESOURCE,
    CORRECT_MAJOR_MINOR_ANS,
    MAJOR_MINOR_REACT_TIME,
    MAJOR_MINOR_CONGO_DETAILS,
    GET_MAJOR_MINOR_HIGH_SCORE,
    ON_SELECT_DAILY_TIME,
    ON_TRACKED_TIME,
    ON_APP_BACKGROUND_TIME,
    ON_TRACKED_DAYS,
    ON_GET_EAR_SCORE_GRAPH
} from "../actionTypes/courseActionTypes";
import * as trainingJson from '../../utils/keyTraining.json';

const initialData = {
    totalFreeUsers: 0,
    courseList: [],
    courseScreenDetails: '',
    selectedCourseItem: '',
    selectedPatternItem: '',
    isVideoPause: false,
    favoritesPatterns: [],
    trainingTypes: [
        { title: 'One key, random progressions', isSelected: true },
        { title: 'Random keys, one progression', isSelected: false },
        { title: 'Random keys and progressions', isSelected: false }
    ],
    trainingData: trainingJson,
    selectedTrainingIndex: 0,
    selectedLetters: [],
    selectedEarLevel: {},
    earTrainingTypes: [
        { id: 0, title: 'The 7 notes up and down', name: 'all', isSelected: true },
        { id: 1, title: '4 chords', name: 'four', isSelected: false }
    ],
    playingSpeed: [
        { id: 0, title: 'slow', isSelected: false },
        { id: 1, title: 'medium', isSelected: false },
        { id: 2, title: 'fast', isSelected: true },
        { id: 3, title: 'extreme', isSelected: false }
    ],
    selectedEarTraining: {},
    earTrainingCongrats: false,
    earTrainingData: {},
    lettersArray: trainingJson,
    earLetterSound: {},
    currentNoteSound: {},
    isCorrectNotePlayed: false,
    isNotePlayedValue: 0,
    isNoteHighlightValue: 0,
    isNoteClicked: false,
    isCorrectHighlight: false,
    correctAns: 0,
    earCongratsDetails: {},
    earAvgReactTimes: [],
    isAvgReactTimes: false,
    noOfExercise: 0,
    majorMinorResource: {},
    correctMajorMinorAns: 0,
    majorMinorAvgReactTimes: [],
    majorMinorCongratsDetails: {},
    majorMinorHighScore: {
        best_time: 0
    },
    selectedDailyTime: '0:30',
    trackedTime: '00:00',
    trackedDays: '',
    trackedTimeProgress: 0,
    appBackgroundTime: '',
    earScoreGraph: {
        graphData: [],
        scores: [],
        scoreDifference: 0
    },
};

const courseReducers = (state = initialData, action) => {
    switch (action.type) {
        case COURSES:
            return {
                ...state,
                totalFreeUsers: action.freeUser,
                courseList: action.payload,
                courseScreenDetails: action.courseScreenDetails
            }
        case ON_COURSE_ITEM_CLICKED:
            return {
                ...state,
                selectedCourseItem: action.payload
            }
        case ON_PATTERN_ITEM_CLICKED:
            return {
                ...state,
                selectedPatternItem: action.payload,
                isVideoPause: action.flag
            }
        case FAVORITES_PATTERNS:
            return {
                ...state,
                favoritesPatterns: action.payload
            }
        case ON_UPDATE_TRAINING_TYPE:
            return {
                ...state,
                trainingTypes: action.payload,
                selectedTrainingIndex: action.index
            }
        case ON_UPDATE_TRAINING_TABS:
            return {
                ...state,
                trainingData: action.payload
            }
        case SELECTED_LETTERS:
            return {
                ...state,
                selectedLetters: action.payload
            }
        case ON_EAR_LEVEL:
            return {
                ...state,
                selectedEarLevel: action.payload
            }
        case ON_UPDATE_EAR_TRAINING_TYPE:
            return {
                ...state,
                earTrainingTypes: action.payload
            }
        case ON_UPDATE_EAR_TRAINING_TABS:
            return {
                ...state,
                playingSpeed: action.payload
            }
        case ON_EAR_TRAINING_START:
            return {
                ...state,
                selectedEarTraining: action.payload
            }
        case ON_EAR_TRAINING_CONGRATS:
            return {
                ...state,
                earTrainingCongrats: action.payload
            }
        case ON_EAR_TRAINING_DATA:
            return {
                ...state,
                earTrainingData: action.payload
            }
        case ON_EAR_LETTER_SOUND:
            return {
                ...state,
                earLetterSound: action.payload
            }
        case ON_CURRENT_NOTE_PLAYED:
            return {
                ...state,
                currentNoteSound: action.payload
            }
        case IS_CORRECT_NOTE:
            return {
                ...state,
                isCorrectNotePlayed: action.payload,
                isNotePlayedValue: action.value
            }
        case IS_NOTE_HIGHLIGHT:
            return {
                ...state,
                isNoteHighlightValue: action.value,
                isCorrectHighlight: action.flag
            }
        case IS_NOTE_CLICKED:
            return {
                ...state,
                isNoteClicked: action.payload
            }
        case IS_CORRECT_HIGHLIGHT:
            return {
                ...state,
                isCorrectHighlight: action.flag
            }
        case CORRECT_ANS:
            return {
                ...state,
                correctAns: action.payload
            }
        case EAR_CONGO_DETAILS:
            return {
                ...state,
                earCongratsDetails: action.payload
            }
        case ON_EAR_AVG_REACT_TIME:
            return {
                ...state,
                earAvgReactTimes: action.payload
            }
        case IS_EAR_AVG_REACT_TIME:
            return {
                ...state,
                isAvgReactTimes: action.payload
            }
        case NO_OF_EAR_EXERCISE:
            return {
                ...state,
                noOfExercise: action.payload
            }
        case MAJOR_MINOR_RESOURCE:
            if (action.flag) {
                return {
                    ...state,
                    correctMajorMinorAns: 0,
                    majorMinorAvgReactTimes: [],
                    majorMinorCongratsDetails: {},
                    majorMinorResource: action.payload
                }
            } else
                return {
                    ...state,
                    majorMinorResource: action.payload
                }
        case CORRECT_MAJOR_MINOR_ANS:
            return {
                ...state,
                correctMajorMinorAns: action.payload
            }
        case MAJOR_MINOR_REACT_TIME:
            return {
                ...state,
                majorMinorAvgReactTimes: action.payload
            }
        case MAJOR_MINOR_CONGO_DETAILS:
            return {
                ...state,
                majorMinorCongratsDetails: action.payload
            }
        case GET_MAJOR_MINOR_HIGH_SCORE:
            return {
                ...state,
                majorMinorHighScore: action.payload
            }
        case ON_SELECT_DAILY_TIME:
            return {
                ...state,
                selectedDailyTime: action.payload
            }
        case ON_TRACKED_TIME:
            return {
                ...state,
                trackedTime: action.payload,
                trackedTimeProgress: action.progressFormula
            }
        case ON_TRACKED_DAYS:
            return {
                ...state,
                trackedDays: action.payload
            }
        case ON_APP_BACKGROUND_TIME:
            return {
                ...state,
                appBackgroundTime: action.payload
            }
        case ON_GET_EAR_SCORE_GRAPH:
            return {
                ...state,
                earScoreGraph: action.payload
            }
        default:
            return state;
    }
};
export default courseReducers;