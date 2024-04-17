import { lazy, useState } from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import styles from './main.module.css'
import { useAtom } from 'jotai';

const Preview = lazy(()=> import('../components/editor/preview'))

function PanelResizeCollapseHandle({
    collapsepanel,
    className = "",
    id
  }: {
    collapsepanel: number
    className?: string;
    id?: string;
  }) {
    const clicked = function(element: Element) {
        const icon = element.nativeEvent.target
        if (icon.getAttribute("transform") != null) {
            // the panel is collapsed
            icon.removeAttribute("transform")
        } else {
            // the panel is open
            icon.setAttribute("transform", "rotate(180)");
        }
    }
    return (
      <PanelResizeHandle
        className={[styles.ResizeHandleOuter, className].join(" ")}
        id={id}
        onClick={clicked}
      >
        <div className={styles.ResizeHandleInner}>
          <svg className={styles.Icon} viewBox="0 0 32 32">
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
        <PanelGroup autoSaveId="MainPagePanels" direction="horizontal">
            <Panel order={1} defaultSize={20} collapsible={true}>
                <div key="files" style={{border: "1px solid green"}}>
                    <ul>
                        <li>file</li>
                        <li>goes</li>
                        <li>here</li>
                    </ul>
                </div>
            </Panel>
            <PanelResizeCollapseHandle collapsepanel={1} />
            <Panel order={2} defaultSize={40} collapsible={true}>
                <div key="editor" style={{border: "1px solid red", height: "100vh"}}>
                    <p>Hello world</p>
                </div>
            </Panel>
            <PanelResizeCollapseHandle collapsepanel={3} />
            <Panel order={3} defaultSize={40} collapsible={true}>
                <div key="pdf" style={{border: "1px solid blue", height: "100vh"}}>
                    <Preview />
                </div>
            </Panel>
        </PanelGroup>
    )
}