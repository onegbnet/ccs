%% resumecls.cls — 上游 resumecls 原样 vendor 进本仓(由 resumecls.dtx docstrip 抽出)。
%%
%% 上游:https://github.com/huxuan/resumecls · CTAN /macros/xetex/latex/resumecls
%% 作者:huxuan <i@huxuan.org>   Copyright (C) 2012-2020
%% 许可:LPPL-1.3 —— 下面这段版权与许可声明按 LPPL 要求原样保留。
%%
%%   This work may be distributed and/or modified under the conditions of the
%%   LaTeX Project Public License, either version 1.3 of this license or (at
%%   your option) any later version.
%%   The latest version of this license is in
%%     http://www.latex-project.org/lppl.txt
%%   This work has the LPPL maintenance status 'maintained'.
%%   The Current Maintainer of this work is huxuan <i@huxuan.org>.
%%
%% 为什么选它:CTAN 上 39 个 cv 包里**唯一语言特化**的那个,XeTeX 原生、中英双语。
%% cvb 的适配:**一行未改**。字体不在这里定 —— 类走 ctexart,我们用 fontset=none
%% 由生成器挂上自己的子集字体(WASM 里没有系统字体,ctex-fontset-* 一律用不上)。
\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{resumecls}
\newif\ifrclscolor\rclscolorfalse
\DeclareOption{color}{\rclscolortrue}
\DeclareOption*{\PassOptionsToClass{\CurrentOption}{ctexart}}
\ProcessOptions\relax
\LoadClass[a4paper,12pt]{ctexart}
\RequirePackage[top=.5in,bottom=.5in,left=.5in,right=.5in]{geometry}
\RequirePackage[xetex,unicode]{hyperref}
\RequirePackage{tabularx}
\RequirePackage{color}
\RequirePackage{fancyhdr}
\definecolor{heading}{gray}{0.85}
\ifrclscolor
    \hypersetup{colorlinks}
\else
    \hypersetup{hidelinks}
\fi
\RequirePackage[sort&compress]{natbib}
\bibliographystyle{unsrt}
\setlength{\bibsep}{0pt}
\def\rclsname{}
\newcommand\name[1]{\def\rclsname{#1}}
\def\rclsorganization{}
\newcommand\organization[1]{\def\rclsorganization{#1}}
\def\rclsaddress{}
\newcommand\address[1]{\def\rclsaddress{#1}}
\def\rclsmobile{}
\newcommand\mobile[1]{\def\rclsmobile{#1}}
\def\rclsmail{}
\newcommand\mail[1]{\def\rclsmail{#1}}
\def\rclshomepage{}
\newcommand\homepage[1]{\def\rclshomepage{#1}}
\def\rclsleftfooter{}
\newcommand\leftfooter[1]{\def\rclsleftfooter{#1}}
\def\rclsrightfooter{}
\newcommand\rightfooter[1]{\def\rclsrightfooter{#1}}
\newcommand{\heading}[1]{%
    \colorbox{heading}{%
        \parbox{.98\textwidth}{%
            \bfseries\zihao{4}#1
        }
    } \\
}
\newcommand{\entry}[3]{%
    \begin{tabularx}{\textwidth}{@{\hspace{#1}}#2}
        #3
    \end{tabularx}
}
\renewcommand{\maketitle}{%
    \entry{0em}{Xr}{%
        \bfseries\zihao{4}\rclsname & \rclsmobile \\
        \rclsorganization & \href{mailto:\rclsmail}{\rclsmail} \\
        \rclsaddress & \url{\rclshomepage} \\
    }
}
\pagestyle{fancy}
\fancyhf{}
\renewcommand{\headrulewidth}{0pt}
\renewcommand{\footrulewidth}{0pt}
\fancyfoot[L]{\footnotesize \rclsleftfooter}
\fancyfoot[R]{\footnotesize \rclsrightfooter}
\renewcommand{\refname}{}
