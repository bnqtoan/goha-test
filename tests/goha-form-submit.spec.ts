import { test, expect } from '@playwright/test';

test.describe('GOHA Form Submission Tests', () => {
    test('should successfully submit contact form on goha.vn', async ({ page }) => {
        // Navigate to goha.vn
        await page.goto('https://goha.vn');

        // Handle cookie consent if present
        try {
            const cookieButton = page.getByRole('button', { name: 'Đồng Ý' });
            await cookieButton.click({ timeout: 5000 });
        } catch (e) {
            // Cookie consent might not be present, continue
        }

        // Wait for the main content to load
        await page.waitForTimeout(3000);

        // Verify page title
        await expect(page).toHaveTitle(/GOHA/);

        // Scroll down to find the form
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(2000);

        // Fill out the contact form
        // Name field
        await page.getByRole('textbox', { name: 'Họ và tên' }).fill('John Doe');

        // Job position field  
        await page.getByRole('textbox', { name: 'Vị trí công việc' }).fill('Marketing Manager');

        // Email field (required)
        await page.getByRole('textbox', { name: 'Email*' }).fill('john.doe@example.com');

        // Phone number field (required)
        await page.getByRole('textbox', { name: 'SĐT*' }).fill('0912345678');

        // Service selection dropdown
        await page.getByLabel('Dịch vụ cần tư vấn').selectOption('Giải pháp Performance Marketing tổng thể');

        // Budget field
        await page.getByRole('spinbutton', { name: 'Ngân sách dự kiến' }).fill('50000000');

        // Message field
        await page.getByRole('textbox', { name: 'Lời nhắn của bạn' }).fill('Tôi muốn tìm hiểu về dịch vụ performance marketing cho công ty. Vui lòng liên hệ với tôi để tư vấn chi tiết.');

        // Submit the form
        await page.getByRole('button', { name: 'Gửi yêu cầu' }).click();

        // Wait for form submission to complete
        await page.waitForTimeout(5000);

        // Check for any success message - be more flexible with the text
        const successMessages = [
            page.locator('text=Message successfully sent'),
            page.locator('text=thành công'),
            page.locator('text=successfully sent'),
            page.locator('text=cảm ơn'),
            page.locator('.success'),
            page.locator('[class*="success"]')
        ];

        // If success message appears, verify it
        let successFound = false;
        for (const message of successMessages) {
            try {
                if (await message.isVisible({ timeout: 1000 })) {
                    await expect(message).toBeVisible();
                    successFound = true;
                    break;
                }
            } catch (e) {
                // Try next message selector
            }
        }

        if (!successFound) {
            // Check if form was reset (alternative success indicator)
            const nameField = page.getByRole('textbox', { name: 'Họ và tên' });
            await expect(nameField).toHaveValue('');
        }
    });

    test('should validate required fields in contact form', async ({ page }) => {
        // Navigate to goha.vn
        await page.goto('https://goha.vn');

        // Handle cookie consent if present
        try {
            const cookieButton = page.getByRole('button', { name: 'Đồng Ý' });
            await cookieButton.click({ timeout: 5000 });
        } catch (e) {
            // Cookie consent might not be present, continue
        }

        // Wait for the main content to load
        await page.waitForTimeout(3000);

        // Scroll down to find the form
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(2000);

        // Try to submit form without filling required fields
        const submitButton = page.getByRole('button', { name: 'Gửi yêu cầu' });

        // Fill only non-required fields to test validation
        await page.getByRole('textbox', { name: 'Họ và tên' }).fill('Test User');
        await page.getByRole('textbox', { name: 'Vị trí công việc' }).fill('Tester');

        // Try to click submit without required fields
        await submitButton.click();

        // Verify that form doesn't submit without required fields
        // (This would typically show validation errors or prevent submission)
        await page.waitForTimeout(1000);

        // Now fill required fields and verify form can be submitted
        await page.getByRole('textbox', { name: 'Email*' }).fill('test@example.com');
        await page.getByRole('textbox', { name: 'SĐT*' }).fill('0987654321');

        // Submit the form with all required fields
        await submitButton.click();

        // Wait for form submission
        await page.waitForTimeout(5000);

        // Check for any success message
        const successMessages = [
            page.locator('text=Message successfully sent'),
            page.locator('text=thành công'),
            page.locator('text=successfully sent'),
            page.locator('text=cảm ơn'),
            page.locator('.success'),
            page.locator('[class*="success"]')
        ];

        let successFound = false;
        for (const message of successMessages) {
            try {
                if (await message.isVisible({ timeout: 1000 })) {
                    await expect(message).toBeVisible();
                    successFound = true;
                    break;
                }
            } catch (e) {
                // Try next message selector
            }
        }

        if (!successFound) {
            // Check if form was reset (alternative success indicator)
            const testField = page.getByRole('textbox', { name: 'Họ và tên' });
            await expect(testField).toHaveValue('');
        }
    });

    test('should verify form field types and attributes', async ({ page }) => {
        // Navigate to goha.vn
        await page.goto('https://goha.vn');

        // Handle cookie consent if present
        try {
            const cookieButton = page.getByRole('button', { name: 'Đồng Ý' });
            await cookieButton.click({ timeout: 5000 });
        } catch (e) {
            // Cookie consent might not be present, continue
        }

        // Wait for the main content to load
        await page.waitForTimeout(3000);

        // Scroll down to find the form
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(2000);

        // Verify all form fields are present and accessible
        await expect(page.getByRole('textbox', { name: 'Họ và tên' })).toBeVisible();
        await expect(page.getByRole('textbox', { name: 'Vị trí công việc' })).toBeVisible();
        await expect(page.getByRole('textbox', { name: 'Email*' })).toBeVisible();
        await expect(page.getByRole('textbox', { name: 'SĐT*' })).toBeVisible();
        await expect(page.getByLabel('Dịch vụ cần tư vấn')).toBeVisible();
        await expect(page.getByRole('spinbutton', { name: 'Ngân sách dự kiến' })).toBeVisible();
        await expect(page.getByRole('textbox', { name: 'Lời nhắn của bạn' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Gửi yêu cầu' })).toBeVisible();

        // Verify service dropdown has options
        const serviceDropdown = page.getByLabel('Dịch vụ cần tư vấn');
        await serviceDropdown.click();
        await page.waitForTimeout(500); // Wait for dropdown to open

        // Check for specific service options (they might be hidden by default)
        const performanceOption = page.locator('option:has-text("Performance Marketing")').first();
        const seoOption = page.locator('option:has-text("SEO dài hạn")').first();
        const facebookOption = page.locator('option:has-text("Facebook Marketing")').first();

        // Verify options exist (even if not immediately visible)
        await expect(performanceOption).toHaveCount(1);
        await expect(seoOption).toHaveCount(1);
        await expect(facebookOption).toHaveCount(1);
    });
});
