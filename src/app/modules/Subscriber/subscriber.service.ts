import { Request } from "express";
import AppError from "../../errors/AppError";
import { StatusCodes } from "http-status-codes";
import emailSender from "../../../utils/emailSender";
import config from "../../../config";

const createSubscriber = async (req: Request) => {
  const { email } = req.body;

  if (!email) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Email is required");
  }

  const htmlContent = `
  <div style="background-color:#1a001f; padding: 40px 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #f4f4f4;">
    <table width="100%" style="max-width: 600px; margin: 0 auto; background-color:#2d0033; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.4);">
      <tr>
        <td style="padding: 30px; text-align: center;">
          <h1 style="color: #e0aaff; font-size: 28px; margin-bottom: 20px;">🎉 Welcome to <span style="color:#ffffff;">Eventlyze</span>!</h1>
          <p style="font-size: 16px; line-height: 1.6; color: #dddddd;">
            Thank you for subscribing to our newsletter. We're thrilled to have you with us! Get ready to receive the latest updates, event inspirations, and exclusive offers straight to your inbox.
          </p>
          <div style="margin-top: 30px;">
            <a href="${config.CLIENT_URL}" target="_blank" style="padding: 12px 24px; background-color: #8000ff; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold;">
              Explore Now
            </a>
          </div>
          <hr style="margin: 40px 0; border: 0; height: 1px; background: #550066;" />
          <p style="font-size: 12px; color: #999999;">
            If you did not subscribe to this newsletter, you can safely ignore this email.
          </p>
          <p style="font-size: 12px; color: #666666;">
            &copy; ${new Date().getFullYear()} Eventlyze. All rights reserved.
          </p>
        </td>
      </tr>
    </table>
  </div>
`;

  const textContent = "Thank you for subscribing! We will keep you updated.";

  try {
    await emailSender(email, "Welcome to Eventlyze!", textContent, htmlContent);
  } catch (error) {
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to send confirmation email"
    );
  }

  return { message: "Subscription successful! Check your email." };
};

export const SubscriberService = {
  createSubscriber,
};
