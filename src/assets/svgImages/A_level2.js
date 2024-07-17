import * as React from "react"
import Svg, { G, Path, Rect, Text, TSpan } from "react-native-svg"
import { SVGheight, SVGwidth } from "../../utils/constants"
import { SvgImagesAction } from "../../utils/svgImagesAction"
import { useSelector } from 'react-redux';

function A_level2(props) {
    const courseReducers = useSelector(state => state.courseReducers);
    return (
        <Svg
            xmlns="http://www.w3.org/2000/svg"
            width={SVGwidth}
            height={SVGheight}
            viewBox="0 0 1256.4 448"
            {...props}
        >
            <G data-name="Group 4921">
                <G data-name="Group 3037">
                    <Path
                        data-name="Rectangle 1735"
                        d="M0 0h148v300a15 15 0 01-15 15H50a50 50 0 01-50-50z"
                        transform="translate(7.4 -3703) translate(-869 1203) translate(1969 2633)"
                        fill="#ccc"
                    />
                    <Path
                        data-name="Rectangle 1734"
                        d="M0 0h37v204H18a18 18 0 01-18-18z"
                        transform="translate(7.4 -3703) translate(-869 1203) translate(2081 2631)"
                        fill="#141414"
                    />
                    <Path
                        data-name="Rectangle 938"
                        d="M0 0h133a15 15 0 0115 15v285a15 15 0 01-15 15H15a15 15 0 01-15-15z"
                        transform="translate(7.4 -3703) translate(-869 1203) translate(1179 2633)"
                        fill="#ccc"
                    />
                    <Path
                        data-name="Rectangle 908"
                        d="M0 0h148v300a15 15 0 01-15 15H15a15 15 0 01-15-15z"
                        transform="translate(7.4 -3703) translate(-869 1203) translate(1337 2633)"
                        fill="#ccc"
                    />
                    <Path
                        data-name="Rectangle 940"
                        d="M0 0h148v300a15 15 0 01-15 15H15a15 15 0 01-15-15z"
                        transform="translate(7.4 -3703) translate(-869 1203) translate(1495 2633)"
                        fill="#ccc"
                    />
                    <Path
                        data-name="Rectangle 941"
                        d="M0 0h148v300a15 15 0 01-15 15H15a15 15 0 01-15-15z"
                        transform="translate(7.4 -3703) translate(-869 1203) translate(1653 2633)"
                        fill="#ccc"
                    />
                    <Path
                        data-name="Rectangle 943"
                        d="M0 0h148v265a50 50 0 01-50 50H15a15 15 0 01-15-15z"
                        transform="translate(7.4 -3703) translate(-869 1203) translate(1811 2633)"
                        fill="#ccc"
                    />
                    <Path
                        data-name="Rectangle 937"
                        d="M0 0h82v186a18 18 0 01-18 18H18a18 18 0 01-18-18z"
                        transform="translate(7.4 -3703) translate(-869 1203) translate(1290 2631)"
                        fill="#141414"
                    />
                    <Path
                        data-name="Rectangle 939"
                        d="M0 0h82v186a18 18 0 01-18 18H18a18 18 0 01-18-18z"
                        transform="translate(7.4 -3703) translate(-869 1203) translate(1449 2631)"
                        fill="#141414"
                    />
                    <Path
                        data-name="Rectangle 944"
                        d="M0 0h82v186a18 18 0 01-18 18H18a18 18 0 01-18-18z"
                        transform="translate(7.4 -3703) translate(-869 1203) translate(1923 2631)"
                        fill="#141414"
                    />
                    <Path
                        data-name="Rectangle 942"
                        d="M0 0h82v186a18 18 0 01-18 18H18a18 18 0 01-18-18z"
                        transform="translate(7.4 -3703) translate(-869 1203) translate(1765 2631)"
                        fill="#141414"
                    />
                    <Path
                        data-name="Rectangle 910"
                        d="M25 0h123v300a15 15 0 01-15 15H50a50 50 0 01-50-50V25A25 25 0 0125 0z"
                        transform="translate(7.4 -3703) translate(-869 1203) translate(863 2633)"
                        fill="#ccc"
                    />
                    <Path
                        data-name="Rectangle 920"
                        d="M25 0h123v300a15 15 0 01-15 15H15a15 15 0 01-15-15V25A25 25 0 0125 0z"
                        transform="translate(7.4 -3703) translate(-869 1203) translate(1021 2633)"
                        fill="#ccc"
                    />
                    <Path
                        data-name="Rectangle 918"
                        d="M0 0h37v186a18 18 0 01-18 18H0z"
                        transform="translate(7.4 -3703) translate(-869 1203) translate(862 2631)"
                        fill="#141414"
                    />
                    <Path
                        data-name="Rectangle 919"
                        d="M0 0h82v186a18 18 0 01-18 18H18a18 18 0 01-18-18z"
                        transform="translate(7.4 -3703) translate(-869 1203) translate(975 2631)"
                        fill="#141414"
                    />
                    <G
                        data-name="Group 4835"
                        transform="translate(7.4 -3703) translate(-869 1203) translate(1343 -126)"
                        onPressIn={() => { SvgImagesAction(6) }}>
                        <Rect
                            data-name="Rectangle 1624"
                            width={126}
                            height={108}
                            rx={45}
                            transform="translate(400 2833)"
                            fill={courseReducers.isNoteHighlightValue === 6 ? courseReducers.isCorrectHighlight ? "#00BF53" : "#999999" : "#242424"}
                        />
                        <Text
                            data-name={6}
                            transform="translate(440.6 2916)"
                            fill="#fff"
                            fontSize={80}
                            fontFamily="QanelasSoftDEMO-ExtraBold, Qanelas Soft DEMO"
                            fontWeight={800}
                        >
                            <TSpan x={0} y={0}>
                                {"6"}
                            </TSpan>
                        </Text>
                    </G>
                    <G
                        data-name="Group 4836"
                        transform="translate(7.4 -3703) translate(-869 1203) translate(1501 -126)"
                        onPressIn={() => { SvgImagesAction(7) }}>
                        <Rect
                            data-name="Rectangle 1624"
                            width={126}
                            height={108}
                            rx={45}
                            transform="translate(400 2833)"
                            fill={courseReducers.isNoteHighlightValue === 7 ? courseReducers.isCorrectHighlight ? "#00BF53" : "#999999" : "#242424"}
                        />
                        <Text
                            data-name={7}
                            transform="translate(443.4 2916)"
                            fill="#fff"
                            fontSize={80}
                            fontFamily="QanelasSoftDEMO-ExtraBold, Qanelas Soft DEMO"
                            fontWeight={800}
                        >
                            <TSpan x={0} y={0}>
                                {"7"}
                            </TSpan>
                        </Text>
                    </G>
                    <G
                        data-name="Group 4531"
                        transform="translate(7.4 -3703) translate(-869 1203) translate(790)"
                        onPressIn={() => { SvgImagesAction(5) }}>
                        <Rect
                            data-name="Rectangle 1626"
                            width={126}
                            height={108}
                            rx={45}
                            transform="translate(716 2833)"
                            fill={courseReducers.isNoteHighlightValue === 5 ? courseReducers.isCorrectHighlight ? "#00BF53" : "#999999" : "#242424"}
                        />
                        <Text
                            data-name={5}
                            transform="translate(756.6 2916)"
                            fill="#fff"
                            fontSize={80}
                            fontFamily="QanelasSoftDEMO-ExtraBold, Qanelas Soft DEMO"
                            fontWeight={800}
                        >
                            <TSpan x={0} y={0}>
                                {"5"}
                            </TSpan>
                        </Text>
                    </G>
                    <G
                        data-name="Group 4532"
                        transform="translate(7.4 -3703) translate(-869 1203) translate(790)"
                        onPressIn={() => { SvgImagesAction(1) }}>
                        <Rect
                            data-name="Rectangle 1650"
                            width={126}
                            height={108}
                            rx={45}
                            transform="translate(1190 2833)"
                            fill={courseReducers.isNoteHighlightValue === 1 ? courseReducers.isCorrectHighlight ? "#00BF53" : "#999999" : "#242424"}
                        />
                        <Text
                            data-name={1}
                            transform="translate(1237 2916)"
                            fill="#fff"
                            fontSize={80}
                            fontFamily="QanelasSoftDEMO-ExtraBold, Qanelas Soft DEMO"
                            fontWeight={800}
                        >
                            <TSpan x={0} y={0}>
                                {"1"}
                            </TSpan>
                        </Text>
                    </G>
                </G>
                <Text
                    transform="translate(7.4 -3703) translate(-7.4 3782)"
                    fill="#e6e6e6"
                    fontSize={80}
                    fontFamily="QanelasSoftDEMO-ExtraBold, Qanelas Soft DEMO"
                    fontWeight={800}
                >
                    <TSpan x={0} y={0}>
                        {"A"}
                    </TSpan>
                </Text>
            </G>
        </Svg>
    )
}

export default A_level2