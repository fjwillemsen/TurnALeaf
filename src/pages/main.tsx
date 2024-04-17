import { lazy, Component } from 'react'
import { Responsive, WidthProvider } from 'react-grid-layout'

import '../../node_modules/react-grid-layout/css/styles.css'
import '../../node_modules/react-resizable/css/styles.css'

const Preview = lazy(()=> import('../components/editor/preview'))

const FullGridLayout = WidthProvider(Responsive);

class Grid extends Component {
  render() {
    // layout is an array of objects, see the demo for more complete usage
    const layout = [
        { i: "files", x: 0, y: 0, w: 2, h: 1, static: true },
        { i: "editor", x: 2, y: 0, w: 5, h: 1, minW: 2, maxW: 10, minH: 1, maxH: 1 },
        { i: "pdf", x: 7, y: 0, w: 5, h: 1, minH: 1, maxH: 1 }
    ]
    const layouts = {
        lg: layout,
        xxs: layout
    };
    return (
      <FullGridLayout
        className="layout"
        layouts={layouts}
        rowHeight={document.body.clientHeight}
        maxRows={1}
        compactType={'horizontal'}
        cols={{lg: 12, md: 12, sm: 12, xs: 12, xxs: 12}}
        margin={[20, 20]}
      >
        <div key="files" style={{border: "1px solid green"}}>
            <ul>
                <li>file</li>
                <li>goes</li>
                <li>here</li>
            </ul>
        </div>
        <div key="editor" style={{border: "1px solid red"}}>
            <p>Hello world</p>
        </div>
        <div key="pdf" style={{border: "1px solid blue"}}>
            <Preview />
        </div>
      </FullGridLayout>
    );
  }
}

export default function MainPage() {
    return (
        <Grid/>
    )
}