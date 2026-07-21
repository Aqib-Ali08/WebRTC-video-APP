const fs = require('fs');
const path = require('path');

const replacements = [
  { search: /"#0e7490"/g, replace: '"primary.main"' },
  { search: /"#155e75"/g, replace: '"primary.dark"' },
  { search: /"#fff"/g, replace: '"background.paper"' },
  { search: /"#64748b"/g, replace: '"text.secondary"' },
  { search: /"#f1f5f9"/g, replace: '"action.hover"' },
  { search: /"#f8fafc"/g, replace: '"background.default"' },
  { search: /"#ef4444"/g, replace: '"error.main"' },
  { search: /"#dc2626"/g, replace: '"error.dark"' },
  { search: /"#cbd5e1"/g, replace: '"divider"' },
  { search: /"#94a3b8"/g, replace: '"action.focus"' },
  { search: /"#e2e8f0"/g, replace: '"divider"' },
  { search: /"#334155"/g, replace: '"text.primary"' },
  { search: /"#1e293b"/g, replace: '"text.primary"' },
  { search: /"#475569"/g, replace: '"text.secondary"' },
  { search: /"rgba\(14, 116, 144, 0.08\)"/g, replace: '"action.selected"' },
  { search: /"#f5f5f5"/g, replace: '"background.default"' },
  { search: /"#e0e0e0"/g, replace: '"action.selected"' },
  { search: /"#b2ebf2"/g, replace: '"action.hover"' },
  { search: /"#eee"/g, replace: '"divider"' },
  { search: /"#ff5252"/g, replace: '"error.main"' },
  { search: /"#e64949"/g, replace: '"error.dark"' },
  { search: /"#faac15"/g, replace: '"warning.main"' },
  { search: /"#f9fafb"/g, replace: '"background.default"' },
  { search: /"#f3f5ff"/g, replace: '"action.hover"' },
  { search: /"#fff3e0"/g, replace: '"warning.light"' },
  { search: /"white"/g, replace: '"background.paper"' },
  { search: /"rgba\(0,0,0,0.1\)"/g, replace: '"action.selected"' },
];

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // For SharedNotes specifically, some #fff might be text color.
    if (filePath.endsWith('SharedNotes.jsx')) {
      content = content.replace(/color: "#fff"/g, 'color: "primary.contrastText"');
    }

    for (const { search, replace } of replacements) {
      content = content.replace(search, replace);
    }

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated: ${filePath}`);
    }
  } catch (err) {
    console.error(`Error processing ${filePath}:`, err.message);
  }
}

const filesToProcess = [
  'src/components/SharedNotes.jsx',
  'src/components/MessageList.jsx',
  'src/components/MessageBubble.jsx',
  'src/components/ConnectionCard.jsx',
  'src/components/ChatListItem.jsx',
  'src/components/ChatInput.jsx',
  'src/components/ChatHeader.jsx',
  'src/pages/RegisterPage.jsx',
  'src/pages/LoginPage.jsx',
  'src/pages/MeetingListPage.jsx',
  'src/pages/ChatProfilePanel.jsx'
];

filesToProcess.forEach(file => {
  const absolutePath = path.join(__dirname, file);
  processFile(absolutePath);
});
