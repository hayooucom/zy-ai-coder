# 展映AI coder 自动代码补全 VSCode 插件

请阅读 [展映AI coder 使用说明](https://docs.qq.com/doc/p/7435957583efb5dac41648290e65294c76fdf53b)

与 [hf.co/models](https://huggingface.hf.co/models) 上的开源代码模型兼容。 合作/模型）。

** 公告（2023 年 8 月 25 日）：此扩展的最新版本支持 [codellama/CodeLlama-13b-hf](http://hf.co/codellama/CodeLlama-13b-hf)。 查找更多信息 [此处](#code-llama) 如何使用此扩展测试 Code Llama。

** 公告（2023 年 9 月 4 日）：此扩展的最新版本支持 [Phind/Phind-CodeLlama-34B-v2](http://hf.co/Phind/Phind-CodeLlama-34B-v2) 和 [WizardLM/ WizardCoder-Python-34B-V1.0](http://hf.co/WizardLM/WizardCoder-Python-34B-V1.0)。 在[此处](#phind-and-wizardcoder)查找更多信息，了解如何使用此扩展测试这些模型。

我们还提供以下扩展：
* [neovim](https://github.com/huggingface/hfcc.nvim)
* [jupyter](https://github.com/bigcode-project/jupytercoder)

目前支持的型号有：

* 来自 [BigCode](https://www.bigcode-project.org/) 项目的 [StarCoder](https://huggingface.co/blog/starcoder)。 查找更多信息[此处](https://huggingface.co/blog/starcoder)。
* 来自 Meta 的 [Code Llama](http://hf.co/codellama)。 查找更多信息[此处](http://hf.co/blog/codellama)。

## 安装

像任何其他 [vscode 扩展](https://marketplace.visualstudio.com/items?itemName=Telfordpan.zy-ai-coder) 一样安装。

默认情况下，此扩展使用 [bigcode/starcoder](https://huggingface.co/bigcode/starcoder) 和 [Hugging Face Inference API](https://huggingface.co/inference-api) 进行推理。 但是，您可以[配置](#configuring) 向非 Hugging Face Inference API 的自定义端点发出推理请求。 因此，如果您使用默认的 Hugging Face Inference AP 推理，则需要提供 [HF API 令牌](#hf-api-token)。

#### HF API 令牌

您可以使用以下命令提供您的 HF API 令牌（[hf.co/settings/token](https://hf.co/settings/token)）：
1. `Cmd/Ctrl+Shift+P` 打开 VSCode 命令面板
2. 输入：`拥抱脸部代码：设置 API 令牌`

<img src="https://github.com/hayooucom/zy-ai-coder/raw/master/assets/set-api-token.png" width="800px">

## 测试

1.新建一个python文件
2. 尝试输入 `def main():`

<img src="https://github.com/hayooucom/zy-ai-coder/raw/master/assets/ext-working.png" width="800px">

#### 检查生成的代码是否在 [The Stack](https://huggingface.co/datasets/bigcode/the-stack) 中

点击“Cmd+shift+a”检查生成的代码是否在[The Stack](https://huggingface.co/datasets/bigcode/the-stack)中。
这是使用 [stack.dataportraits.org](https://stack.dataportraits.org) 进行的快速首次归因检查。
我们检查与布隆过滤器匹配的至少 50 个字符的序列。
这意味着误报是可能的，并且需要足够长的周围上下文（有关 n-gram 跨步和序列长度的详细信息，请参阅[论文](https://dataportraits.org/)）。
[专用堆栈搜索工具](https://hf.co/spaces/bigcode/search) 是完整的数据集索引，可用于完整的第二遍。


## 开发中
确保您已在系统上[安装了yarn](https://yarnpkg.com/getting-started/install)。
1. 克隆此存储库：`git clone https://github.com/hayooucom/zy-ai-coder`
2. 安装 deps: `cd zy-ai-coder && yarn install --frozen-lockfile`
3. 在 vscode 中，打开“运行和调试”侧栏并单击“启动扩展”

## 检查输出

您可以看到代码生成 API 的输入和输出：

1. 打开 VSCode `OUTPUT` 面板
2.选择‘抱脸码’

<img src="https://github.com/hayooucom/zy-ai-coder/raw/master/assets/ext-output.png" width="800px">

## 配置

您可以配置：发送请求的端点和特殊令牌。

<img src="https://github.com/hayooucom/zy-ai-coder/raw/master/assets/set-configs.png" width="800px">

例子：

假设您当前的代码是这样的：
```py
import numpy as np
import scipy as sp
{YOUR_CURSOR_POSITION}
def hello_world():
    print("Hello world")
````

然后，请求正文将如下所示：
```js
const inputs = `{start token}import numpy as np\nimport scipy as sp\n{end token}def hello_world():\n    print("Hello world"){middle token}`
const data = {inputs, parameters:{max_new_tokens:256}};  // {"inputs": "", "parameters": {"max_new_tokens": 256}}

const res = await fetch(endpoint, {
    body: JSON.stringify(data),
    headers,
    method: "POST"
});

const json = await res.json() as any as {generated_text: string};  // {"generated_text": ""}
```

## codeLLama代码

测试 Code Llama 13B 模型：
1. 确保您拥有[此扩展的最新版本](#installing)。
2. 确保您有[提供的 HF API 令牌](#hf-api-token) 或者[展映AI的API token](https://docs.qq.com/doc/p/7435957583efb5dac41648290e65294c76fdf53b)
3. 打开 Vscode 设置（`cmd+,`）并输入：`拥抱面部代码：配置模板`
4. 从下拉菜单中选择“codellama/CodeLlama-13b-hf”

<img src="https://github.com/hayooucom/zy-ai-coder/raw/master/assets/set-code-llama.png" width="600px">

阅读更多[此处](https://huggingface.co/blog/codellama) 关于 Code LLama。

## Phind 和 WizardCoder

测试 [Phind/Phind-CodeLlama-34B-v2](http://hf.co/Phind/Phind-CodeLlama-34B-v2) 和 或 [WizardLM/WizardCoder-Python-34B-V1.0](http://hf.co/WizardLM/WizardCoder-Python-34B-V1.0）：
1. 确保您拥有[此扩展的最新版本](#installing)。
2. 确保您有[提供的 HF API 令牌](#hf-api-token)
3. 打开 Vscode 设置（`cmd+,`）并输入：`Hugging face 代码：配置模板`
4. 从下拉菜单中选择“Phind/Phind-CodeLlama-34B-v2”或“WizardLM/WizardCoder-Python-34B-V1.0”

<img src="https://github.com/hayooucom/zy-ai-coder/raw/master/assets/set-phind-wizardcoder.png" width="600px">

详细了解 Phind-CodeLlama-34B-v2 [此处](https://huggingface.co/Phind/Phind-CodeLlama-34B-v2) 和 WizardCoder-15B-V1.0 [此处](https://huggingface. co/WizardLM/WizardCoder-15B-V1.0)。
＃＃ 社区
