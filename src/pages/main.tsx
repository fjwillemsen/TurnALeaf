import { lazy, Component } from 'react'
import { Responsive, WidthProvider} from 'react-grid-layout'

import '../../node_modules/react-grid-layout/css/styles.css'
import '../../node_modules/react-resizable/css/styles.css'

const Preview = lazy(()=> import('../components/editor/preview'))

const FullGridLayout = WidthProvider(Responsive);

class Grid extends Component {
  render() {
    // layout is an array of objects, see the demo for more complete usage
    const layouts = {
        lg: [
            { i: "files", x: 0, y: 0, w: 2, h: 1, static: true },
            { i: "editor", x: 2, y: 0, w: 5, h: 1, minW: 2, maxW: 10 },
            { i: "pdf", x: 7, y: 0, w: 5, h: 1 }
        ],
        xxs: [
            { i: "files", x: 0, y: 0, w: 2, h: 1, static: true },
            { i: "editor", x: 2, y: 0, w: 5, h: 1, minW: 2, maxW: 10 },
            { i: "pdf", x: 7, y: 0, w: 5, h: 1 }
        ]
    };
    return (
      <FullGridLayout
        className="layout"
        layouts={layouts}
        cols={{lg: 12, md: 12, sm: 12, xs: 12, xxs: 12}}
        margin={[20, 20]}
      >
        <div key="files">
            <ul>
                <li>file</li>
                <li>goes</li>
                <li>here</li>
            </ul>
        </div>
        <div key="editor" style={{backgroundColor: 'red'}}>
            <p>Hello world</p>
        </div>
        <div key="pdf">
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