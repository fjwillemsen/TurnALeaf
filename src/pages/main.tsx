import { lazy, useState, createRef, RefObject } from "react";
import { ImperativePanelHandle, Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import styles from "./main.module.css";

const Preview = lazy(() => import("../components/editor/preview"));

const panelRefs: RefObject<ImperativePanelHandle>[] = new Array(3).fill(null).map(() => createRef());

function PanelResizeCollapseHandle({
    collapsePanel,
    right = false,
    className = "",
}: {
    collapsePanel: number;
    right?: boolean;
    className?: string;
    id?: string;
}) {
    const [isright, setIsRight] = useState(right);
    const handleClick = () => {
        const panel = panelRefs[collapsePanel].current;
        if (panel == null) {
            console.error("Panel reference not defined");
        } else {
            setIsRight(right ? panel.isCollapsed : panel.isExpanded);
            if (panel.isExpanded()) {
                panel.collapse();
            } else {
                panel.expand();
            }
        }
    };
    return (
        <PanelResizeHandle className={[styles.ResizeHandleOuter, className].join(" ")} onClick={handleClick}>
            <div className={styles.ResizeHandleInner}>
                <svg
                    className={styles.Icon}
                    style={{ transform: isright ? "rotate(180deg)" : "rotate(0deg)" }}
                    viewBox="0 0 32 32"
                >
                    <path
                        fill="currentColor"
                        d="M14.19 16.005l7.869 7.868-2.129 2.129-9.996-9.997L19.937 6.002l2.127 2.129z"
                    />
                </svg>
            </div>
        </PanelResizeHandle>
    );
}

export default function MainPage() {
    return (
        <PanelGroup autoSaveId="MainPagePanels" direction="horizontal" style={{ width: "100vw", height: "100vh" }}>
            <Panel ref={panelRefs[0]} order={1} defaultSize={20} collapsible={true} minSize={2}>
                <div key="files" style={{ border: "1px solid green", height: "100%" }}>
                    <ul>
                        <li>file</li>
                        <li>goes</li>
                        <li>here</li>
                    </ul>
                </div>
            </Panel>
            <PanelResizeCollapseHandle collapsePanel={0} />
            <Panel ref={panelRefs[1]} order={2} defaultSize={40} collapsible={false} minSize={2}>
                <div key="editor" style={{ border: "1px solid red", height: "100%" }}>
                    <p>Hello world</p>
                </div>
            </Panel>
            <PanelResizeCollapseHandle collapsePanel={2} right={true} />
            <Panel ref={panelRefs[2]} order={3} defaultSize={40} collapsible={true} minSize={2}>
                <div key="pdf" style={{ border: "1px solid blue", height: "100%" }}>
                    <Preview />
                </div>
            </Panel>
        </PanelGroup>
    );
}
