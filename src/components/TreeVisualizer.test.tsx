import { mock, test, expect, describe, beforeEach } from "bun:test";

// Constants from component/styles
const HIGHLIGHT_COLOR = "rgba(111, 29, 27, 0.86)";
const VISITED_COLOR = "rgba(65, 32, 109, 0.86)";
const ROOT_INDICATOR_COLOR = "#fde68a";
const LEAF_INDICATOR_COLOR = "#86efac";

// Mock assets
mock.module("../../assets/acorn.png", () => ({ default: "acorn.png" }));
mock.module("../../assets/grapes.png", () => ({ default: "grapes.png" }));
mock.module("../../assets/apple_v2.png", () => ({ default: "apple_v2.png" }));
mock.module("../../assets/magic_lamp.png", () => ({ default: "magic_lamp.png" }));

// Mock react
const ReactMock = {
  createElement: (type: any, props: any, ...children: any[]) => ({ type, props: { ...props, children }, children }),
  useState: (initial: any) => [initial, () => {}],
  useEffect: () => {},
  useRef: (initial: any) => ({ current: initial }),
  FC: ({ children }: any) => children,
  Fragment: "Symbol(react.fragment)",
};

mock.module("react", () => ReactMock);

const jsx = (type: any, props: any, key: any) => ({
  type,
  props,
  key,
  get children() {
    return this.props?.children;
  },
});

// Mock react/jsx-dev-runtime and react/jsx-runtime
mock.module("react/jsx-dev-runtime", () => ({
  jsxDEV: jsx,
  jsxsDEV: jsx,
  Fragment: "Symbol(react.fragment)",
}));

mock.module("react/jsx-runtime", () => ({
  jsx: jsx,
  jsxs: jsx,
  Fragment: "Symbol(react.fragment)",
}));

// Mock motion/react
mock.module("motion/react", () => ({
  motion: {
    image: "motion.image",
    circle: "motion.circle",
    div: "motion.div",
  },
}));

describe("TreeVisualizer", () => {
  let TreeVisualizer: any;

  beforeEach(async () => {
    const module = await import("./TreeVisualizer");
    TreeVisualizer = module.TreeVisualizer;
  });

  const findChildByClassName = (element: any, className: string): any => {
    if (!element) return null;
    if (element.props?.className === className) return element;
    if (!element.props || !element.props.children) return null;
    const children = Array.isArray(element.props.children) ? element.props.children : [element.props.children];
    for (const child of children) {
      const found = findChildByClassName(child, className);
      if (found) return found;
    }
    return null;
  };

  const findChildByType = (element: any, type: any): any => {
    if (!element) return null;
    if (element.type === type) return element;
    if (!element.props || !element.props.children) return null;
    const children = Array.isArray(element.props.children) ? element.props.children : [element.props.children];
    for (const child of children) {
      const found = findChildByType(child, type);
      if (found) return found;
    }
    return null;
  };

  const findAllChildrenByType = (element: any, type: any, results: any[] = []): any[] => {
    if (!element) return results;
    if (element.type === type) results.push(element);
    if (!element.props || !element.props.children) return results;
    const children = Array.isArray(element.props.children) ? element.props.children : [element.props.children];
    for (const child of children) {
      findAllChildrenByType(child, type, results);
    }
    return results;
  };

  test("renders empty state when root is null", () => {
    const props = {
      root: null,
      highlightedNodes: [],
      visitedNodes: [],
    };
    const result = TreeVisualizer(props);

    expect(result).toBeDefined();

    const emptyState = findChildByClassName(result, "empty-tree-state");
    expect(emptyState).toBeDefined();

    const text = findChildByType(emptyState, "p");
    expect(text.props.children).toBe("Insert your first value to create the binary tree.");
  });

  test("renders root node and its label", () => {
    const root = {
      id: "1",
      value: 10,
      x: 400,
      y: 60,
      left: null,
      right: null,
    };
    const props = {
      root,
      highlightedNodes: [],
      visitedNodes: [],
    };
    const result = TreeVisualizer(props);

    const svg = findChildByType(result, "svg");
    expect(svg).toBeDefined();

    const text = findChildByType(svg, "text");
    expect(text).toBeDefined();
    expect(text.props.children).toBe(10);
  });

  test("identifies highlighted and visited nodes", () => {
    const root = {
      id: "1",
      value: 10,
      x: 400,
      y: 60,
      left: null,
      right: null,
    };

    const resultHighlighted = TreeVisualizer({
      root,
      highlightedNodes: ["1"],
      visitedNodes: [],
    });

    const circleH = findChildByType(resultHighlighted, "motion.circle");
    expect(circleH).toBeDefined();
    expect(circleH.props.fill).toBe(HIGHLIGHT_COLOR);

    const imageH = findChildByType(resultHighlighted, "motion.image");
    expect(imageH.props.href).toBe("acorn.png");

    const resultVisited = TreeVisualizer({
      root,
      highlightedNodes: [],
      visitedNodes: ["1"],
    });

    const circleV = findChildByType(resultVisited, "motion.circle");
    expect(circleV).toBeDefined();
    expect(circleV.props.fill).toBe(VISITED_COLOR);

    const imageV = findChildByType(resultVisited, "motion.image");
    expect(imageV.props.href).toBe("grapes.png");
  });

  test("renders correct asset based on even/odd value", () => {
    const rootEven = {
      id: "1",
      value: 10,
      x: 400,
      y: 60,
      left: null,
      right: null,
    };
    const resultEven = TreeVisualizer({ root: rootEven, highlightedNodes: [], visitedNodes: [] });
    const imageEven = findChildByType(resultEven, "motion.image");
    expect(imageEven.props.href).toBe("apple_v2.png");

    const rootOdd = {
      id: "2",
      value: 11,
      x: 400,
      y: 60,
      left: null,
      right: null,
    };
    const resultOdd = TreeVisualizer({ root: rootOdd, highlightedNodes: [], visitedNodes: [] });
    const imageOdd = findChildByType(resultOdd, "motion.image");
    expect(imageOdd.props.href).toBe("acorn.png");
  });

  test("renders edges between nodes", () => {
    const root = {
      id: "1",
      value: 10,
      x: 400,
      y: 60,
      left: {
        id: "2",
        value: 5,
        x: 300,
        y: 140,
        left: null,
        right: null,
      },
      right: null,
    };

    const result = TreeVisualizer({
      root,
      highlightedNodes: [],
      visitedNodes: [],
    });

    const line = findChildByType(result, "line");
    expect(line).toBeDefined();
    expect(line.props.x1).toBe(root.x);
    expect(line.props.y1).toBe(root.y);
    expect(line.props.x2).toBe(root.left.x);
    expect(line.props.y2).toBe(root.left.y);
  });

  test("renders root and leaf indicators", () => {
    const root = {
      id: "1",
      value: 10,
      x: 400,
      y: 60,
      left: {
        id: "2",
        value: 5,
        x: 300,
        y: 140,
        left: null,
        right: null,
      },
      right: null,
    };

    const result = TreeVisualizer({
      root,
      highlightedNodes: [],
      visitedNodes: [],
    });

    const circles = findAllChildrenByType(result, "circle");
    expect(circles.length).toBe(2);

    const rootIndicator = circles.find(c => c.props.cy === root.y - 38);
    expect(rootIndicator).toBeDefined();
    expect(rootIndicator.props.fill).toBe(ROOT_INDICATOR_COLOR);

    const leafIndicator = circles.find(c => c.props.cy === root.left.y + 34);
    expect(leafIndicator).toBeDefined();
    expect(leafIndicator.props.fill).toBe(LEAF_INDICATOR_COLOR);
  });
});
