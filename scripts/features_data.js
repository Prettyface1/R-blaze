const bulkFeatures = [
    {
        id: 'feat/ui-button',
        steps: [
            { file: 'src/components/ui/Button.tsx', content: "import React from 'react';\n", msg: 'feat: add React import to Button' },
            { file: 'src/components/ui/Button.tsx', content: "export const Button = ({ children, variant }) => (\n", msg: 'feat: define Button component' },
            { file: 'src/components/ui/Button.tsx', content: "  <button className={`btn btn-${variant}`}>{children}</button>\n);\n", msg: 'feat: implement Button render' }
        ]
    },
    {
        id: 'feat/ui-card',
        steps: [
            { file: 'src/components/ui/Card.tsx', content: "export const Card = ({ children }) => (\n", msg: 'feat: define Card component' },
            { file: 'src/components/ui/Card.tsx', content: "  <div className='glass p-6'>{children}</div>\n);\n", msg: 'feat: implement Card glass effect' }
        ]
    },
    {
        id: 'feat/layout-header',
        steps: [
            { file: 'src/components/layout/Header.tsx', content: "export const Header = () => (\n", msg: 'feat: add Header layout' },
            { file: 'src/components/layout/Header.tsx', content: "  <header className='flex justify-between items-center p-4'>\n", msg: 'feat: add Header styles' },
            { file: 'src/components/layout/Header.tsx', content: "    <div className='gradient-text font-bold text-2xl'>R-blaze</div>\n", msg: 'feat: add Logo to Header' },
            { file: 'src/components/layout/Header.tsx', content: "  </header>\n);\n", msg: 'feat: close Header component' }
        ]
    },
    {
        id: 'docs/architecture',
        steps: [
            { file: 'docs/ARCH.md', content: "# Architecture\n", msg: 'docs: create architecture doc' },
            { file: 'docs/ARCH.md', content: "## Smart Contracts\nBuilt with Clarity 4.\n", msg: 'docs: add contract section' },
            { file: 'docs/ARCH.md', content: "## Frontend\nBuilt with Next.js and Stacks Connect.\n", msg: 'docs: add frontend section' }
        ]
    }
];

export default bulkFeatures;
