import * as React from "react"
import Svg, { G, Path, Rect, Text, TSpan } from "react-native-svg"
import { SVGheight, SVGwidth } from "../../utils/constants"
import { SvgImagesAction } from "../../utils/svgImagesAction"
import { useSelector } from 'react-redux';

function D_level1(props) {
    const courseReducers = useSelector(state => state.courseReducers);
    return (
        <Svg
            xmlns="http://www.w3.org/2000/svg"
            width={SVGwidth}
            height={SVGheight}
            viewBox="0 0 1256 450"
            {...props}
        >
            <G data-name="Group 4874">
                <G
                    data-name="Group 3028"
                    transform="translate(7 -1347) translate(-237 -1153)"
                >
                    <Path
                        data-name="Rectangle 908"
                        d="M0 0h148v265a50 50 0 01-50 50H15a15 15 0 01-15-15z"
                        transform="translate(1179 2633)"
                        fill="#ccc"
                    />
                    <Path
                        data-name="Rectangle 909"
                        d="M15 0h118a15 15 0 0115 15v285a15 15 0 01-15 15H50a50 50 0 01-50-50V15A15 15 0 0115 0z"
                        transform="translate(231 2633)"
                        fill="#ccc"
                    />
                    <Path
                        data-name="Rectangle 1727"
                        d="M15 0h118a15 15 0 0115 15v285a15 15 0 01-15 15H50a50 50 0 01-50-50V15A15 15 0 0115 0z"
                        transform="translate(1337 2635)"
                        fill="#ccc"
                    />
                    <Path
                        data-name="Rectangle 910"
                        d="M25 0h123v300a15 15 0 01-15 15H15a15 15 0 01-15-15V25A25 25 0 0125 0z"
                        transform="translate(389 2633)"
                        fill="#ccc"
                    />
                    <Path
                        data-name="Rectangle 913"
                        d="M0 0h37v186a18 18 0 01-18 18H0z"
                        transform="translate(230 2631)"
                        fill="#141414"
                    />
                    <Path
                        data-name="Rectangle 937"
                        d="M0 0h82v186a18 18 0 01-18 18H18a18 18 0 01-18-18z"
                        transform="translate(1291 2631)"
                        fill="#141414"
                    />
                    <Path
                        data-name="Rectangle 918"
                        d="M0 0h82v186a18 18 0 01-18 18H18a18 18 0 01-18-18z"
                        transform="translate(343 2631)"
                        fill="#141414"
                    />
                    <Path
                        data-name="Rectangle 1726"
                        d="M0 0h37v204H18a18 18 0 01-18-18z"
                        transform="translate(1449 2633)"
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
                    <G data-name="Group 4529" transform="translate(158)" onPressIn={() => { SvgImagesAction(2) }}>
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
                    <G data-name="Group 4833" transform="translate(395 -126)" onPressIn={() => { SvgImagesAction(3) }}>
                        <Rect
                            data-name="Rectangle 1623"
                            width={126}
                            height={108}
                            rx={45}
                            transform="translate(242 2833)"
                            fill={courseReducers.isNoteHighlightValue === 3 ? courseReducers.isCorrectHighlight ? "#00BF53" : "#999999" : "#242424"}
                        />
                        <Text
                            data-name={3}
                            transform="translate(283 2916)"
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
                    <G data-name="Group 4530" transform="translate(158)" onPressIn={() => { SvgImagesAction(4) }}>
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
                    <G data-name="Group 4528" transform="translate(158)" onPressIn={() => { SvgImagesAction(1) }}>
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
                    transform="translate(7 -1347) translate(-7 1426)"
                    fill="#e6e6e6"
                    fontSize={80}
                    fontFamily="QanelasSoftDEMO-ExtraBold, Qanelas Soft DEMO"
                    fontWeight={800}
                >
                    <TSpan x={0} y={0}>
                        {"D"}
                    </TSpan>
                </Text>
            </G>
        </Svg>
    )
}

export default D_level1
