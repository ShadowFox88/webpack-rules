let properties = {
    assets: null,
    nodeModules: null
};


let set = (key, value) => properties[key] ??= value;
function use(key) {
    function get() {
        return properties[key];
    }

    return get;
}


function createRule(options) {
    function rule() {
        for (const [key, option] of Object.entries(options)) {
            let resolved;

            if (option instanceof Function) {
                resolved = option();
            } else {
                resolved = option;
            }

            if (resolved === option) {
                continue;
            } else if (!resolved) {
                delete options[key]
            } else {
                options[key] = resolved;
            }
        }

        return options;
    }

    return rule;
}


let css = createRule({
    test: /\.css$/i,
    use: ["style-loader", "css-loader"]
});
let images = createRule({
    include: use("assets"),
    test: /\.(png|svg|jpe?g|gif)$/i,
    type: "asset/resource"
})
let js = createRule({
    exclude: use("nodeModules"),
    resolve: {
        fullySpecified: false
    },
    test: /\.m?js$/i,
});
let jsx = createRule({
    exclude: use("nodeModules"),
    resolve: {
        fullySpecified: false
    },
    test: /\.(mjs|jsx?)$/i,
    use: {
        loader: "babel-loader",
        options: {
            presets: ["@babel/preset-env"]
        }
    }
});

export default {
    css,
    images,
    js,
    jsx,
    set
};
