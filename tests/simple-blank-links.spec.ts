import { test, expect } from '@playwright/test';

interface BlankLinkResult {
    navigation: Array<{
        text: string;
        position: { top: number; left: number };
        context: string;
    }>;
    content: Array<{
        text: string;
        position: { top: number; left: number };
        parent: string;
    }>;
    footer: Array<{
        text: string;
        position: { top: number; left: number };
    }>;
}

test.describe('Smart Blank Links Checker', () => {
    test('should warn for navigation blank links but fail for content blank links', async ({ page }) => {
        // Navigate to goha.vn
        await page.goto('https://goha.vn');
        await page.waitForLoadState('domcontentloaded');

        // Single scroll to trigger all animations and collect blank links data
        console.log('🔄 Single scroll through page to trigger animations and collect data...');

        // Analyze and categorize blank links during scroll
        const blankLinksAnalysis: BlankLinkResult = await page.evaluate(() => {
            // Get page dimensions for scrolling
            const pageHeight = document.body.scrollHeight;
            const viewportHeight = window.innerHeight;
            const scrollSteps = Math.ceil(pageHeight / viewportHeight);
            
            // Single scroll through page to trigger all animations
            for (let i = 0; i <= scrollSteps; i++) {
                const scrollY = (i * viewportHeight);
                window.scrollTo(0, scrollY);
                // Short delay for animations (synchronous)
                const start = Date.now();
                while (Date.now() - start < 500) { /* wait */ }
            }
            
            // Scroll back to top
            window.scrollTo(0, 0);
            
            // Now analyze blank links after everything is loaded
            const blankLinks = document.querySelectorAll('a[href="#"]');
            const result: BlankLinkResult = {
                navigation: [],
                content: [],
                footer: []
            };

            blankLinks.forEach((link) => {
                const element = link as HTMLElement;
                const text = element.textContent?.trim() || '';
                const rect = element.getBoundingClientRect();
                
                // Check if link is in navigation context
                const nav = element.closest('nav, .nav, .navbar, .navigation, .menu, header, .bricks-nav-menu-wrapper, .bricks-mobile-menu-wrapper');
                const footer = element.closest('footer, .footer');
                
                const position = {
                    top: Math.round(rect.top + window.scrollY),
                    left: Math.round(rect.left)
                };

                if (nav) {
                    result.navigation.push({
                        text: text,
                        position: position,
                        context: nav.className || 'navigation'
                    });
                } else if (footer) {
                    result.footer.push({
                        text: text,
                        position: position
                    });
                } else {
                    result.content.push({
                        text: text,
                        position: position,
                        parent: element.parentElement?.tagName || 'unknown'
                    });
                }
            });

            return result;
        });

        // Take a "before" screenshot for comparison
        const beforeScreenshot = await page.screenshot({
            fullPage: true
        });

        // Attach "before" screenshot to test report
        await test.info().attach('Page Before Highlighting', {
            body: beforeScreenshot,
            contentType: 'image/png'
        });

        // Highlight different types of blank links with different colors
        await page.evaluate(() => {
            const blankLinks = document.querySelectorAll('a[href="#"]');
            let navIndex = 1;
            let contentIndex = 1;
            let footerIndex = 1;

            blankLinks.forEach((link) => {
                const element = link as HTMLElement;
                const nav = element.closest('nav, .nav, .navbar, .navigation, .menu, header, .bricks-nav-menu-wrapper, .bricks-mobile-menu-wrapper');
                const footer = element.closest('footer, .footer');

                // Base styling
                element.style.setProperty('padding', '4px', 'important');
                element.style.setProperty('position', 'relative', 'important');
                element.style.setProperty('z-index', '9999', 'important');

                let badge: HTMLElement;
                let badgeText: string;
                let borderColor: string;
                let backgroundColor: string;
                let badgeColor: string;

                if (nav) {
                    // Navigation links - Orange warning
                    borderColor = '3px solid orange';
                    backgroundColor = '#fff3cd'; // Light yellow
                    badgeColor = 'orange';
                    badgeText = `N${navIndex++}`;
                } else if (footer) {
                    // Footer links - Blue info
                    borderColor = '3px solid blue';
                    backgroundColor = '#cce5ff';
                    badgeColor = 'blue';
                    badgeText = `F${footerIndex++}`;
                } else {
                    // Content links - Red error
                    borderColor = '3px solid red';
                    backgroundColor = '#ffebee'; // Light red
                    badgeColor = 'red';
                    badgeText = `C${contentIndex++}`;
                }

                element.style.setProperty('border', borderColor, 'important');
                element.style.setProperty('background-color', backgroundColor, 'important');

                // Add numbered badge
                badge = document.createElement('span');
                badge.textContent = badgeText;
                badge.style.setProperty('position', 'absolute', 'important');
                badge.style.setProperty('top', '-12px', 'important');
                badge.style.setProperty('right', '-12px', 'important');
                badge.style.setProperty('background-color', badgeColor, 'important');
                badge.style.setProperty('color', 'white', 'important');
                badge.style.setProperty('border-radius', '50%', 'important');
                badge.style.setProperty('width', '24px', 'important');
                badge.style.setProperty('height', '24px', 'important');
                badge.style.setProperty('font-size', '11px', 'important');
                badge.style.setProperty('display', 'flex', 'important');
                badge.style.setProperty('align-items', 'center', 'important');
                badge.style.setProperty('justify-content', 'center', 'important');
                badge.style.setProperty('font-weight', 'bold', 'important');
                badge.style.setProperty('z-index', '10000', 'important');
                badge.style.setProperty('border', '2px solid white', 'important');

                element.appendChild(badge);
            });
        });

        // Wait for highlighting to apply
        await page.waitForTimeout(1000);

        // Take screenshot with highlighted links
        const screenshot = await page.screenshot({
            path: 'test-results/blank-links-categorized.png',
            fullPage: true
        });

        // Attach screenshot to test report
        await test.info().attach('Blank Links Categorized', {
            body: screenshot,
            contentType: 'image/png'
        });

        // Log detailed results
        console.log('\n📊 BLANK LINKS ANALYSIS RESULTS:');
        console.log('═══════════════════════════════════════════════════════════════');
        
        if (blankLinksAnalysis.navigation.length > 0) {
            console.log(`\n⚠️  NAVIGATION BLANK LINKS (${blankLinksAnalysis.navigation.length}) - WARNING ONLY:`);
            blankLinksAnalysis.navigation.forEach((link, index) => {
                console.log(`  N${index + 1}. "${link.text}" - ${link.position.top}px from top (${link.context})`);
            });
            console.log('   → These are likely dropdown menu triggers and are acceptable');
        }

        if (blankLinksAnalysis.footer.length > 0) {
            console.log(`\n💙 FOOTER BLANK LINKS (${blankLinksAnalysis.footer.length}) - INFO:`);
            blankLinksAnalysis.footer.forEach((link, index) => {
                console.log(`  F${index + 1}. "${link.text}" - ${link.position.top}px from top`);
            });
        }

        if (blankLinksAnalysis.content.length > 0) {
            console.log(`\n🔴 CONTENT BLANK LINKS (${blankLinksAnalysis.content.length}) - CRITICAL ERRORS:`);
            blankLinksAnalysis.content.forEach((link, index) => {
                console.log(`  C${index + 1}. "${link.text}" - ${link.position.top}px from top (${link.parent})`);
            });
            console.log('   → These should have proper URLs and need to be fixed!');
        }

        console.log('\n📸 Screenshot legend:');
        console.log('   🟠 Orange (N#) = Navigation warnings');
        console.log('   🔵 Blue (F#) = Footer info');
        console.log('   🔴 Red (C#) = Content errors');

        // Generate summary for test report
        const totalLinks = blankLinksAnalysis.navigation.length + blankLinksAnalysis.content.length + blankLinksAnalysis.footer.length;
        const summary = `Found ${totalLinks} blank links: ${blankLinksAnalysis.navigation.length} navigation (warnings), ${blankLinksAnalysis.content.length} content (errors), ${blankLinksAnalysis.footer.length} footer (info)`;

        await test.info().attach('Blank Links Summary', {
            body: summary,
            contentType: 'text/plain'
        });

        // ONLY FAIL if there are content blank links (critical errors)
        // Navigation blank links are just warnings (acceptable for dropdown menus)
        expect(blankLinksAnalysis.content.length, 
            `Found ${blankLinksAnalysis.content.length} CRITICAL blank links in content areas that need fixing: ${blankLinksAnalysis.content.map(link => `"${link.text}"`).join(', ')}`
        ).toBe(0);

        // Log warnings but don't fail for navigation links
        if (blankLinksAnalysis.navigation.length > 0) {
            console.log(`\n⚠️  WARNING: ${blankLinksAnalysis.navigation.length} navigation blank links found (acceptable for dropdown menus)`);
        }
    });
});
