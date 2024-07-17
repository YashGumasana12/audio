import * as React from "react"
import Svg, { G, Path, Rect, Text, TSpan } from "react-native-svg"
import { SVGheight, SVGwidth } from "../../utils/constants"
import { SvgImagesAction } from "../../utils/svgImagesAction"
import { useSelector } from 'react-redux';

function Ab_level4(props) {
    const courseReducers = useSelector(state => state.courseReducers);
    return (
        <Svg
            xmlns="http://www.w3.org/2000/svg"
            width={SVGwidth}
            height={SVGheight}
            viewBox="0 0 1232 448"
            {...props}
        >
            <G data-name="Group 4915">
                <G data-name="Group 3026">
                    <Path
                        data-name="Rectangle 910"
                        d="M25 0h123v300a15 15 0 01-15 15H50a50 50 0 01-50-50V25A25 25 0 0125 0z"
                        transform="translate(-2 -758) translate(-793 -1742) translate(863 2633)"
                        fill="#ccc"
                    />
                    <Path
                        data-name="Rectangle 920"
                        d="M25 0h123v300a15 15 0 01-15 15H15a15 15 0 01-15-15V25A25 25 0 0125 0z"
                        transform="translate(-2 -758) translate(-793 -1742) translate(1021 2633)"
                        fill="#ccc"
                    />
                    <Path
                        data-name="Rectangle 947"
                        d="M0 0h148v300a15 15 0 01-15 15H15a15 15 0 01-15-15z"
                        transform="translate(-2 -758) translate(-793 -1742) translate(1179 2633)"
                        fill="#ccc"
                    />
                    <Path
                        data-name="Rectangle 949"
                        d="M0 0h148v300a15 15 0 01-15 15H15a15 15 0 01-15-15z"
                        transform="translate(-2 -758) translate(-793 -1742) translate(1337 2633)"
                        fill="#ccc"
                    />
                    <Path
                        data-name="Rectangle 951"
                        d="M0 0h148v300a15 15 0 01-15 15H15a15 15 0 01-15-15z"
                        transform="translate(-2 -758) translate(-793 -1742) translate(1495 2633)"
                        fill="#ccc"
                    />
                    <Path
                        data-name="Rectangle 952"
                        d="M0 0h148v300a15 15 0 01-15 15H15a15 15 0 01-15-15z"
                        transform="translate(-2 -758) translate(-793 -1742) translate(1653 2633)"
                        fill="#ccc"
                    />
                    <Path
                        data-name="Rectangle 954"
                        d="M0 0h148v265a50 50 0 01-50 50H15a15 15 0 01-15-15z"
                        transform="translate(-2 -758) translate(-793 -1742) translate(1811 2633)"
                        fill="#ccc"
                    />
                    <Path
                        data-name="Rectangle 918"
                        d="M0 0h82v186a18 18 0 01-18 18H18a18 18 0 01-18-18z"
                        transform="translate(-2 -758) translate(-793 -1742) translate(817 2631)"
                        fill="#141414"
                    />
                    <Path
                        data-name="Rectangle 919"
                        d="M0 0h82v186a18 18 0 01-18 18H18a18 18 0 01-18-18z"
                        transform="translate(-2 -758) translate(-793 -1742) translate(975 2631)"
                        fill="#141414"
                    />
                    <Path
                        data-name="Rectangle 948"
                        d="M0 0h82v186a18 18 0 01-18 18H18a18 18 0 01-18-18z"
                        transform="translate(-2 -758) translate(-793 -1742) translate(1291 2631)"
                        fill="#141414"
                    />
                    <Path
                        data-name="Rectangle 950"
                        d="M0 0h82v186a18 18 0 01-18 18H18a18 18 0 01-18-18z"
                        transform="translate(-2 -758) translate(-793 -1742) translate(1449 2631)"
                        fill="#141414"
                    />
                    <Path
                        data-name="Rectangle 953"
                        d="M0 0h82v186a18 18 0 01-18 18H18a18 18 0 01-18-18z"
                        transform="translate(-2 -758) translate(-793 -1742) translate(1765 2631)"
                        fill="#141414"
                    />
                    <Path
                        data-name="Rectangle 955"
                        d="M0 0h82v186a18 18 0 01-18 18H18a18 18 0 01-18-18z"
                        transform="translate(-2 -758) translate(-793 -1742) translate(1923 2631)"
                        fill="#141414"
                    />
                    <G
                        data-name="Group 4529"
                        transform="translate(-2 -758) translate(-793 -1742) translate(711 -126)"
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
                        data-name="Group 4833"
                        transform="translate(-2 -758) translate(-793 -1742) translate(948)"
                        onPressIn={() => { SvgImagesAction(3) }}>
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
                    <G
                        data-name="Group 4525"
                        transform="translate(-2 -758) translate(-793 -1742) translate(632)"
                        onPressIn={() => { SvgImagesAction(2.5) }}>
                        <Rect
                            data-name="Rectangle 1624"
                            width={126}
                            height={108}
                            rx={45}
                            transform="translate(400 2833)"
                            fill={courseReducers.isNoteHighlightValue === 2.5 ? courseReducers.isCorrectHighlight ? "#00BF53" : "#999999" : "#666"}
                        />
                        <Text
                            data-name={2.5}
                            transform="translate(421.72 2909)"
                            fill="#fff"
                            fontSize={60}
                            fontFamily="QanelasSoftDEMO-ExtraBold, Qanelas Soft DEMO"
                            fontWeight={800}
                        >
                            <TSpan x={0} y={0}>
                                {"2.5"}
                            </TSpan>
                        </Text>
                    </G>
                    <G
                        data-name="Group 4832"
                        transform="translate(-2 -758) translate(-793 -1742) translate(474)"
                        onPressIn={() => { SvgImagesAction(1.5) }}>
                        <Rect
                            data-name="Rectangle 1624"
                            width={126}
                            height={108}
                            rx={45}
                            transform="translate(400 2833)"
                            fill={courseReducers.isNoteHighlightValue === 1.5 ? courseReducers.isCorrectHighlight ? "#00BF53" : "#999999" : "#666"}
                        />
                        <Text
                            data-name={1.5}
                            transform="translate(425.8 2909)"
                            fill="#fff"
                            fontSize={60}
                            fontFamily="QanelasSoftDEMO-ExtraBold, Qanelas Soft DEMO"
                            fontWeight={800}
                        >
                            <TSpan x={0} y={0}>
                                {"1.5"}
                            </TSpan>
                        </Text>
                    </G>
                    <G
                        data-name="Group 4834"
                        transform="translate(-2 -758) translate(-793 -1742) translate(948)"
                        onPressIn={() => { SvgImagesAction(4.5) }} >
                        <Rect
                            data-name="Rectangle 1624"
                            width={126}
                            height={108}
                            rx={45}
                            transform="translate(400 2833)"
                            fill={courseReducers.isNoteHighlightValue === 4.5 ? courseReducers.isCorrectHighlight ? "#00BF53" : "#999999" : "#666"}
                        />
                        <Text
                            data-name={4.5}
                            transform="translate(420.1 2909)"
                            fill="#fff"
                            fontSize={60}
                            fontFamily="QanelasSoftDEMO-ExtraBold, Qanelas Soft DEMO"
                            fontWeight={800}
                        >
                            <TSpan x={0} y={0}>
                                {"4.5"}
                            </TSpan>
                        </Text>
                    </G>
                    <G
                        data-name="Group 4835"
                        transform="translate(-2 -758) translate(-793 -1742) translate(1264)"
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
                        transform="translate(-2 -758) translate(-793 -1742) translate(1422)"
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
                        data-name="Group 4530"
                        transform="translate(-2 -758) translate(-793 -1742) translate(711 -126)"
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
                        data-name="Group 4531"
                        transform="translate(-2 -758) translate(-793 -1742) translate(711 -126)"
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
                        data-name="Group 4526"
                        transform="translate(-2 -758) translate(-793 -1742) translate(632)"
                        onPressIn={() => { SvgImagesAction(5.5) }}>
                        <Rect
                            data-name="Rectangle 1627"
                            width={126}
                            height={108}
                            rx={45}
                            transform="translate(874 2833)"
                            fill={courseReducers.isNoteHighlightValue === 5.5 ? courseReducers.isCorrectHighlight ? "#00BF53" : "#999999" : "#666"} />
                        <Text
                            data-name={5.5}
                            transform="translate(895.6 2909)"
                            fill="#fff"
                            fontSize={60}
                            fontFamily="QanelasSoftDEMO-ExtraBold, Qanelas Soft DEMO"
                            fontWeight={800}
                        >
                            <TSpan x={0} y={0}>
                                {"5.5"}
                            </TSpan>
                        </Text>
                    </G>
                    <G
                        data-name="Group 4527"
                        transform="translate(-2 -758) translate(-793 -1742) translate(706 -126)"
                        onPressIn={() => { SvgImagesAction(6.5) }}>
                        <Rect
                            data-name="Rectangle 1628"
                            width={126}
                            height={108}
                            rx={45}
                            transform="translate(1032 2833)"
                            fill={courseReducers.isNoteHighlightValue === 6.5 ? courseReducers.isCorrectHighlight ? "#00BF53" : "#999999" : "#666"} />
                        <Text
                            data-name={6.5}
                            transform="translate(1053.6 2909)"
                            fill="#fff"
                            fontSize={60}
                            fontFamily="QanelasSoftDEMO-ExtraBold, Qanelas Soft DEMO"
                            fontWeight={800}
                        >
                            <TSpan x={0} y={0}>
                                {"6.5"}
                            </TSpan>
                        </Text>
                    </G>
                    <G
                        data-name="Group 4528"
                        transform="translate(-2 -758) translate(-793 -1742) translate(711 -126)"
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
                    <G
                        data-name="Group 4532"
                        transform="translate(-2 -758) translate(-793 -1742) translate(711 -126)"
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
                    transform="translate(-2 -758) translate(69.68 837)"
                    fill="#e6e6e6"
                    fontSize={80}
                    fontFamily="QanelasSoftDEMO-ExtraBold, Qanelas Soft DEMO"
                    fontWeight={800}
                >
                    <TSpan x={0} y={0}>
                        {"Ab"}
                    </TSpan>
                </Text>
            </G>
        </Svg>
    )
}

export default Ab_level4
