namespace ToolGen
{
    partial class Form1
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.btnGenModel = new System.Windows.Forms.Button();
            this.txtModelName = new System.Windows.Forms.TextBox();
            this.txtTableName = new System.Windows.Forms.TextBox();
            this.label1 = new System.Windows.Forms.Label();
            this.label2 = new System.Windows.Forms.Label();
            this.rtfRsl = new System.Windows.Forms.RichTextBox();
            this.SuspendLayout();
            // 
            // btnGenModel
            // 
            this.btnGenModel.Location = new System.Drawing.Point(437, 18);
            this.btnGenModel.Name = "btnGenModel";
            this.btnGenModel.Size = new System.Drawing.Size(75, 23);
            this.btnGenModel.TabIndex = 4;
            this.btnGenModel.Text = "Gen Model";
            this.btnGenModel.UseVisualStyleBackColor = true;
            this.btnGenModel.Click += new System.EventHandler(this.button1_Click);
            // 
            // txtModelName
            // 
            this.txtModelName.Location = new System.Drawing.Point(290, 20);
            this.txtModelName.Name = "txtModelName";
            this.txtModelName.Size = new System.Drawing.Size(119, 20);
            this.txtModelName.TabIndex = 3;
            // 
            // txtTableName
            // 
            this.txtTableName.Location = new System.Drawing.Point(84, 20);
            this.txtTableName.Name = "txtTableName";
            this.txtTableName.Size = new System.Drawing.Size(100, 20);
            this.txtTableName.TabIndex = 1;
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(29, 23);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(34, 13);
            this.label1.TabIndex = 0;
            this.label1.Text = "Table";
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(194, 23);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(67, 13);
            this.label2.TabIndex = 2;
            this.label2.Text = "Model Name";
            // 
            // rtfRsl
            // 
            this.rtfRsl.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.rtfRsl.Location = new System.Drawing.Point(12, 47);
            this.rtfRsl.Name = "rtfRsl";
            this.rtfRsl.Size = new System.Drawing.Size(776, 391);
            this.rtfRsl.TabIndex = 5;
            this.rtfRsl.Text = "";
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(800, 450);
            this.Controls.Add(this.rtfRsl);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.txtTableName);
            this.Controls.Add(this.txtModelName);
            this.Controls.Add(this.btnGenModel);
            this.Name = "Form1";
            this.Text = "Form1";
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Button btnGenModel;
        private System.Windows.Forms.TextBox txtModelName;
        private System.Windows.Forms.TextBox txtTableName;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.RichTextBox rtfRsl;
    }
}

