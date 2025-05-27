declare module 'react-to-pdf' {
    import { Component, ReactNode, RefObject } from 'react';

    interface ReactToPdfProps {
        children: (props: { toPdf: () => void }) => ReactNode;
        targetRef: RefObject<HTMLElement>;
        filename?: string;
        options?: object;
        scale?: number;
        x?: number;
        y?: number;
        orientation?: 'portrait' | 'landscape';
    }

    export default class ReactToPdf extends Component<ReactToPdfProps> {}
}
