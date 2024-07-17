import * as React from "react"
import Svg, { G, Path, Rect, Text, TSpan } from "react-native-svg"
import { SVGheight, SVGwidth } from "../../utils/constants"
import { SvgImagesAction } from "../../utils/svgImagesAction"
import { useSelector } from 'react-redux';

function Gbm_level1(props) {
    const courseReducers = useSelector(state => state.courseReducers);
    return (
        <Svg
            xmlns="http://www.w3.org/2000/svg"
            width={SVGwidth}
            height={SVGheight}
            viewBox="0 0 1210 448"
            {...props}
        >
            <G data-name="Group 4906">
                <G data-name="Group 3026">
                    <Path
                        data-name="Rectangle 909"
                        d="M15 0h118a15 15 0 0115 15v285a15 15 0 01-15 15H50a50 50 0 01-50-50V15A15 15 0 0115 0z"
                        transform="translate(39 -758) translate(-676 -1742) translate(705 2633)"
                        fill="#ccc"
                    />
                    <Path
                        data-name="Rectangle 910"
                        d="M25 0h123v300a15 15 0 01-15 15H15a15 15 0 01-15-15V25A25 25 0 0125 0z"
                        transform="translate(39 -758) translate(-676 -1742) translate(863 2633)"
                        fill="#ccc"
                    />
                    <Path
                        data-name="Rectangle 920"
                        d="M25 0h123v300a15 15 0 01-15 15H15a15 15 0 01-15-15V25A25 25 0 0125 0z"
                        transform="translate(39 -758) translate(-676 -1742) translate(1021 2633)"
                        fill="#ccc"
                    />
                    <Path
                        data-name="Rectangle 947"
                        d="M0 0h148v300a15 15 0 01-15 15H15a15 15 0 01-15-15z"
                        transform="translate(39 -758) translate(-676 -1742) translate(1179 2633)"
                        fill="#ccc"
                    />
                    <Path
                        data-name="Rectangle 949"
                        d="M0 0h148v300a15 15 0 01-15 15H15a15 15 0 01-15-15z"
                        transform="translate(39 -758) translate(-676 -1742) translate(1337 2633)"
                        fill="#ccc"
                    />
                    <Path
                        data-name="Rectangle 951"
                        d="M0 0h148v300a15 15 0 01-15 15H15a15 15 0 01-15-15z"
                        transform="translate(39 -758) translate(-676 -1742) translate(1495 2633)"
                        fill="#ccc"
                    />
                    <Path
                        data-name="Rectangle 952"
                        d="M0 0h148v265a50 50 0 01-50 50H15a15 15 0 01-15-15z"
                        transform="translate(39 -758) translate(-676 -1742) translate(1653 2633)"
                        fill="#ccc"
                    />
                    <Path
                        data-name="Rectangle 913"
                        d="M0 0h82v186a18 18 0 01-18 18H18a18 18 0 01-18-18z"
                        transform="translate(39 -758) translate(-676 -1742) translate(659 2631)"
                        fill="#141414"
                    />
                    <Path
                        data-name="Rectangle 918"
                        d="M0 0h82v186a18 18 0 01-18 18H18a18 18 0 01-18-18z"
                        transform="translate(39 -758) translate(-676 -1742) translate(817 2631)"
                        fill="#141414"
                    />
                    <Path
                        data-name="Rectangle 919"
                        d="M0 0h82v186a18 18 0 01-18 18H18a18 18 0 01-18-18z"
                        transform="translate(39 -758) translate(-676 -1742) translate(975 2631)"
                        fill="#141414"
                    />
                    <Path
                        data-name="Rectangle 948"
                        d="M0 0h82v186a18 18 0 01-18 18H18a18 18 0 01-18-18z"
                        transform="translate(39 -758) translate(-676 -1742) translate(1291 2631)"
                        fill="#141414"
                    />
                    <Path
                        data-name="Rectangle 950"
                        d="M0 0h82v186a18 18 0 01-18 18H18a18 18 0 01-18-18z"
                        transform="translate(39 -758) translate(-676 -1742) translate(1449 2631)"
                        fill="#141414"
                    />
                    <Path
                        data-name="Rectangle 953"
                        d="M0 0h82v186a18 18 0 01-18 18H18a18 18 0 01-18-18z"
                        transform="translate(39 -758) translate(-676 -1742) translate(1765 2631)"
                        fill="#141414"
                    />
                    <G
                        data-name="Group 4529"
                        transform="translate(39 -758) translate(-676 -1742) translate(553 -124)"
                        onPressIn={() => { SvgImagesAction(2) }}>
                        <Rect
                            data-name="Rectangle 1623"
                            width={126}
                            height={108}
                            rx={45}
                            transform="translate(242 2833)"
                            fill={courseReducers.isNoteHighlightValue === 2 ? courseReducers.isCorrectHighlight ? "#00BF53" : "#999999" : "#242424"}
                        />
                        <Text
                            data-name={2}
                            transform="translate(283.56 2916)"
                            fill="#fff"
                            fontSize={80}
                            fontFamily="QanelasSoftDEMO-ExtraBold, Qanelas Soft DEMO"
                            fontWeight={800}
                        >
                            <TSpan x={0} y={0}>
                                {"2"}
                            </TSpan>
                        </Text>
                    </G>
                    <G
                        data-name="Group 4525"
                        transform="translate(39 -758) translate(-676 -1742) translate(474 2)"
                        onPressIn={() => { SvgImagesAction(3) }}>
                        <Rect
                            data-name="Rectangle 1624"
                            width={126}
                            height={108}
                            rx={45}
                            transform="translate(400 2833)"
                            fill={courseReducers.isNoteHighlightValue === 3 ? courseReducers.isCorrectHighlight ? "#00BF53" : "#999999" : "#242424"}
                        />
                        <Text
                            data-name={3}
                            transform="translate(441 2916)"
                            fill="#fff"
                            fontSize={80}
                            fontFamily="QanelasSoftDEMO-ExtraBold, Qanelas Soft DEMO"
                            fontWeight={800}
                        >
                            <TSpan x={0} y={0}>
                                {"3"}
                            </TSpan>
                        </Text>
                    </G>
                    <G
                        data-name="Group 4530"
                        transform="translate(39 -758) translate(-676 -1742) translate(474 2)"
                        onPressIn={() => { SvgImagesAction(4) }}>
                        <Rect
                            data-name="Rectangle 1625"
                            width={126}
                            height={108}
                            rx={45}
                            transform="translate(558 2833)"
                            fill={courseReducers.isNoteHighlightValue === 4 ? courseReducers.isCorrectHighlight ? "#00BF53" : "#999999" : "#242424"}
                        />
                        <Text
                            data-name={4}
                            transform="translate(597.4 2916)"
                            fill="#fff"
                            fontSize={80}
                            fontFamily="QanelasSoftDEMO-ExtraBold, Qanelas Soft DEMO"
                            fontWeight={800}
                        >
                            <TSpan x={0} y={0}>
                                {"4"}
                            </TSpan>
                        </Text>
                    </G>
                    <G
                        data-name="Group 4528"
                        transform="translate(39 -758) translate(-676 -1742) translate(553 -124)"
                        onPressIn={() => { SvgImagesAction(1) }}>
                        <Rect
                            data-name="Rectangle 1370"
                            width={126}
                            height={108}
                            rx={45}
                            transform="translate(84 2833)"
                            fill={courseReducers.isNoteHighlightValue === 1 ? courseReducers.isCorrectHighlight ? "#00BF53" : "#999999" : "#242424"}
                        />
                        <Text
                            data-name={1}
                            transform="translate(131 2916)"
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
                    transform="translate(39 -758) translate(29.12 837)"
                    fill="#e6e6e6"
                    fontSize={80}
                    fontFamily="QanelasSoftDEMO-ExtraBold, Qanelas Soft DEMO"
                    fontWeight={800}
                >
                    <TSpan x={0} y={0}>
                        {"Gbm"}
                    </TSpan>
                </Text>
            </G>
        </Svg>
    )
}

export default Gbm_level1
