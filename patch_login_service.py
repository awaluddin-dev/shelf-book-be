import re

with open("src/features/auth/login/login.service.ts", "r") as f:
    content = f.read()

# Add validation logic
old_logic = """    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });"""

new_logic = """    // Validate Cloudflare Turnstile Captcha
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
    if (turnstileSecret) {
      const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `secret=${turnstileSecret}&response=${dto.turnstileToken}`,
      });
      const verifyData = await verifyRes.json();
      if (!verifyData.success) {
        throw new UnauthorizedException('Validasi Captcha gagal');
      }
    }

    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });"""

content = content.replace(old_logic, new_logic)

with open("src/features/auth/login/login.service.ts", "w") as f:
    f.write(content)

