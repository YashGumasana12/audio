import * as React from "react"
import Svg, { G, Path, Rect, Text, TSpan } from "react-native-svg"
import { SVGheight, SVGwidth } from "../../utils/constants"
import { SvgImagesAction } from "../../utils/svgImagesAction"
import { useSelector } from 'react-redux';

function Ebm_level2(props) {
    const courseReducers = useSelector(state => state.courseReducers);
    return (
        <Svg
            xmlns="http://www.w3.org/2000/svg"
            width={SVGwidth}
            height={SVGheight}
            viewBox="0 0 1210 448"
            {...props}
        >
            <G data-name="Group 4885">
                <G
                    data-name="Group 3026"
                    transform="translate(17 -758) translate(-360 -1742)"
                >
                    <Path
                        data-name="Rectangle 910"
                        d="M25 0h123v300a15 15 0 01-15 15H50a50 50 0 01-50-50V25A25 25 0 0125 0z"
                        transform="translate(389 2633)"
                        fill="#ccc"
                    />
                    <Path
                        data-name="Rectangle 918"
                        d="M0 0h82v186a18 18 0 01-18 18H18a18 18 0 01-18-18z"
                        transform="translate(343 2631)"
                        fill="#141414"
                    />
                    <Path
                        data-name="Rectangle 908"
                        d="M0 0h123a25 25 0 0125 25v275a15 15 0 01-15 15H15a15 15 0 01-15-15z"
                        transform="translate(547 2633)"
                        fill="#ccc"
                    />
                    <Rect
                        data-name="Rectangle 909"
                        width={148}
                        height={315}
                        rx={15}
                        transform="translate(705 2633)"
                        fill="#ccc"
                    />
                    <Path
                        data-name="Rectangle 910"
                        d="M25 0h123v300a15 15 0 01-15 15H15a15 15 0 01-15-15V25A25 25 0 0125 0z"
                        transform="translate(863 2633)"
                        fill="#ccc"
                    />
                    <Path
                        data-name="Rectangle 920"
                        d="M25 0h123v300a15 15 0 01-15 15H15a15 15 0 01-15-15V25A25 25 0 0125 0z"
                        transform="translate(1021 2633)"
                        fill="#ccc"
                    />
                    <Path
                        data-name="Rectangle 947"
                        d="M0 0h148v300a15 15 0 01-15 15H15a15 15 0 01-15-15z"
                        transform="translate(1179 2633)"
                        fill="#ccc"
                    />
                    <Path
                        data-name="Rectangle 949"
                        d="M0 0h148v265a50 50 0 01-50 50H15a15 15 0 01-15-15z"
                        transform="translate(1337 2633)"
                        fill="#ccc"
                    />
                    <Path
                        data-name="Rectangle 913"
                        d="M0 0h82v186a18 18 0 01-18 18H18a18 18 0 01-18-18z"
                        transform="translate(659 2631)"
                        fill="#141414"
                    />
                    <Path
                        data-name="Rectangle 918"
                        d="M0 0h82v186a18 18 0 01-18 18H18a18 18 0 01-18-18z"
                        transform="translate(817 2631)"
                        fill="#141414"
                    />
                    <Path
                        data-name="Rectangle 919"
                        d="M0 0h82v186a18 18 0 01-18 18H18a18 18 0 01-18-18z"
                        transform="translate(975 2631)"
                        fill="#141414"
                    />
                    <Path
                        data-name="Rectangle 948"
                        d="M0 0h82v186a18 18 0 01-18 18H18a18 18 0 01-18-18z"
                        transform="translate(1291 2631)"
                        fill="#141414"
                    />
                    <Path
                        data-name="Rectangle 950"
                        d="M0 0h82v186a18 18 0 01-18 18H18a18 18 0 01-18-18z"
                        transform="translate(1449 2631)"
                        fill="#141414"
                    />
                    <G data-name="Group 4531" transform="translate(237 -124)" onPressIn={() => { SvgImagesAction(5) }}>
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
                    <G data-name="Group 4526" transform="translate(158 2)" onPressIn={() => { SvgImagesAction(6) }}>
                        <Rect
                            data-name="Rectangle 1627"
                            width={126}
                            height={108}
                            rx={45}
                            transform="translate(874 2833)"
                            fill={courseReducers.isNoteHighlightValue === 6 ? courseReducers.isCorrectHighlight ? "#00BF53" : "#999999" : "#242424"}
                        />
                        <Text
                            data-name={6}
                            transform="translate(914.6 2916)"
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
                    <G data-name="Group 4527" transform="translate(237 -124)" onPressIn={() => { SvgImagesAction(7) }}>
                        <Rect
                            data-name="Rectangle 1628"
                            width={126}
                            height={108}
                            rx={45}
                            transform="translate(1032 2833)"
                            fill={courseReducers.isNoteHighlightValue === 7 ? courseReducers.isCorrectHighlight ? "#00BF53" : "#999999" : "#242424"}
                        />
                        <Text
                            data-name={7}
                            transform="translate(1075.4 2916)"
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
                    <G data-name="Group 4532" transform="translate(237 -124)" onPressIn={() => { SvgImagesAction(1) }}>
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
                    transform="translate(17 -758) translate(29 837)"
                    fill="#e6e6e6"
                    fontSize={80}
                    fontFamily="QanelasSoftDEMO-ExtraBold, Qanelas Soft DEMO"
                    fontWeight={800}
                >
                    <TSpan x={0} y={0}>
                        {"Ebm"}
                    </TSpan>
                </Text>
            </G>
        </Svg>
    )
}

export default Ebm_level2
