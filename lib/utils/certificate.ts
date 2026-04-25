export function generateCertificateHTML(
  studentName: string,
  courseName: string,
  completionDate: string,
  certificateId: string
): string {
  return `
    <div style="
      width: 100%;
      max-width: 800px;
      margin: 0 auto;
      padding: 48px;
      background: #000000;
      border: 2px solid #FF1493;
      border-radius: 12px;
      position: relative;
      overflow: hidden;
      font-family: 'Montserrat', system-ui, -apple-system, sans-serif;
      color: #FFFFFF;
    ">
      <!-- Decorative corner accents -->
      <div style="
        position: absolute;
        top: 0;
        left: 0;
        width: 120px;
        height: 120px;
        border-top: 4px solid #FF1493;
        border-left: 4px solid #FF1493;
        border-radius: 12px 0 0 0;
        opacity: 0.5;
      "></div>
      <div style="
        position: absolute;
        top: 0;
        right: 0;
        width: 120px;
        height: 120px;
        border-top: 4px solid #FF1493;
        border-right: 4px solid #FF1493;
        border-radius: 0 12px 0 0;
        opacity: 0.5;
      "></div>
      <div style="
        position: absolute;
        bottom: 0;
        left: 0;
        width: 120px;
        height: 120px;
        border-bottom: 4px solid #FF1493;
        border-left: 4px solid #FF1493;
        border-radius: 0 0 0 12px;
        opacity: 0.5;
      "></div>
      <div style="
        position: absolute;
        bottom: 0;
        right: 0;
        width: 120px;
        height: 120px;
        border-bottom: 4px solid #FF1493;
        border-right: 4px solid #FF1493;
        border-radius: 0 0 12px 0;
        opacity: 0.5;
      "></div>

      <!-- Decorative background glow -->
      <div style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 400px;
        height: 400px;
        background: radial-gradient(circle, rgba(255,20,147,0.08) 0%, transparent 70%);
        pointer-events: none;
      "></div>

      <!-- Content -->
      <div style="position: relative; z-index: 1; text-align: center;">
        <!-- Logo -->
        <div style="
          font-size: 28px;
          font-weight: 900;
          letter-spacing: 2px;
          margin-bottom: 8px;
        ">
          <span style="color: #FF1493;">&lt;</span>
          <span style="color: #FFFFFF;"> BA Courses </span>
          <span style="color: #FF1493;">/&gt;</span>
        </div>

        <!-- Divider -->
        <div style="
          width: 80px;
          height: 2px;
          background: linear-gradient(90deg, transparent, #FF1493, transparent);
          margin: 24px auto;
        "></div>

        <!-- Heading -->
        <h1 style="
          font-size: 32px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 4px;
          margin: 0 0 32px 0;
          color: #FFFFFF;
        ">Certificate of Completion</h1>

        <!-- Certifies text -->
        <p style="
          font-size: 14px;
          color: #999999;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin: 0 0 12px 0;
        ">This certifies that</p>

        <!-- Student name -->
        <p style="
          font-size: 36px;
          font-weight: 900;
          color: #FF1493;
          margin: 0 0 12px 0;
          line-height: 1.2;
        ">${escapeHTML(studentName)}</p>

        <!-- Completed text -->
        <p style="
          font-size: 14px;
          color: #999999;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin: 0 0 12px 0;
        ">has successfully completed</p>

        <!-- Course name -->
        <p style="
          font-size: 22px;
          font-weight: 700;
          color: #FFFFFF;
          margin: 0 0 32px 0;
          line-height: 1.3;
        ">${escapeHTML(courseName)}</p>

        <!-- Divider -->
        <div style="
          width: 120px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #444444, transparent);
          margin: 0 auto 24px auto;
        "></div>

        <!-- Date -->
        <p style="
          font-size: 14px;
          color: #999999;
          margin: 0 0 8px 0;
        ">Completed on <span style="color: #FFFFFF; font-weight: 600;">${escapeHTML(completionDate)}</span></p>

        <!-- Certificate ID -->
        <p style="
          font-size: 11px;
          color: #666666;
          margin: 16px 0 0 0;
          letter-spacing: 1px;
        ">Certificate ID: ${escapeHTML(certificateId)}</p>
      </div>
    </div>
  `;
}

function escapeHTML(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
