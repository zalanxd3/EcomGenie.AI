const pool = require('../config/database');
const redis = require('../config/redis');
const nodemailer = require('nodemailer');
const openai = require('../config/openai');

class CartRecoveryService {
  constructor() {
    this.emailTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });
  }

  /**
   * Detect abandoned carts
   */
  async detectAbandonedCarts(storeId, minutesThreshold = 60) {
    try {
      const query = `
        SELECT ac.* FROM abandoned_carts ac
        WHERE ac.store_id = $1 
        AND ac.recovered = false
        AND EXTRACT(EPOCH FROM (NOW() - ac.created_at)) / 60 > $2
      `;
      
      const result = await pool.query(query, [storeId, minutesThreshold]);
      return result.rows;
    } catch (error) {
      throw new Error(`Failed to detect abandoned carts: ${error.message}`);
    }
  }

  /**
   * Generate personalized recovery email content
   */
  async generateRecoveryEmail(cartData, customerData) {
    try {
      const prompt = `Generate a compelling abandoned cart recovery email:
        Customer Name: ${customerData.firstName}
        Products: ${cartData.items.map(i => i.name).join(', ')}
        Total Value: $${cartData.total}
        
        The email should:
        1. Be friendly and personal
        2. Include a sense of urgency (limited time offer)
        3. Have a clear CTA button
        4. Be mobile-friendly
        5. Include a discount offer if provided
        
        Format the response as HTML email body.`;

      const response = await openai.createChatCompletion({
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: [{
          role: 'user',
          content: prompt
        }],
        temperature: 0.7,
        max_tokens: 500
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      throw new Error(`Email generation failed: ${error.message}`);
    }
  }

  /**
   * Send recovery email
   */
  async sendRecoveryEmail(cartId, emailContent, customerEmail) {
    try {
      const mailOptions = {
        from: process.env.SMTP_FROM,
        to: customerEmail,
        subject: "Don't forget your items! Complete your order",
        html: emailContent
      };

      await this.emailTransporter.sendMail(mailOptions);

      // Log the recovery attempt
      await pool.query(
        `UPDATE abandoned_carts SET recovery_emails_sent = recovery_emails_sent + 1 WHERE id = $1`,
        [cartId]
      );

      return { success: true, message: 'Recovery email sent' };
    } catch (error) {
      throw new Error(`Failed to send recovery email: ${error.message}`);
    }
  }

  /**
   * Calculate recovery campaign metrics
   */
  async getRecoveryMetrics(storeId) {
    try {
      const query = `
        SELECT 
          COUNT(*) as total_abandoned,
          SUM(CASE WHEN recovered = true THEN 1 ELSE 0 END) as recovered_carts,
          AVG(total) as avg_cart_value,
          SUM(total) as total_potential_revenue
        FROM abandoned_carts
        WHERE store_id = $1 AND created_at > NOW() - INTERVAL '30 days'
      `;
      
      const result = await pool.query(query, [storeId]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to get recovery metrics: ${error.message}`);
    }
  }
}

module.exports = new CartRecoveryService();
