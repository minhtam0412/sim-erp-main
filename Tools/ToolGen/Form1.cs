using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Data.SqlClient;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace ToolGen
{
    public partial class Form1 : Form
    {
        public static string ConnectionString = "Data Source=192.168.1.8;Initial Catalog=SimERP;Persist Security Info=True;User ID=admin;Password=admin";
        //public static string ConnectionString = "Data Source=45.119.84.185;Initial Catalog=ADS;Persist Security Info=True;User ID=sa;Password=123456aqZ;MultipleActiveResultSets=true;Max Pool Size=300;Min Pool Size=5;connect timeout=0;";
        private SqlConnection connection;

        public enum DataType
        {
            STRING,
            NUMBER,
            BOOLEAN,
            DATE,
            GUID,
            NONE
        };

        List<string> lstString = new List<string> { "varchar", "nvarchar", "ntext" };
        List<string> lstNumber = new List<string> { "numeric", "int", "bigint" };
        List<string> lstGuid = new List<string> { "uniqueidentifier" };
        List<string> lstBoolean = new List<string> { "bit" };
        List<string> lstDate = new List<string> { "datetimeoffset" };

        public Form1()
        {
            InitializeComponent();
            this.connection = new SqlConnection(ConnectionString);
        }

        private DataType CheckDataType(string strColName, DataTable dtbSource)
        {
            DataType rsl = DataType.NONE;
            var row = dtbSource.AsEnumerable().SingleOrDefault(x => Convert.ToString(x["COLUMN_NAME"]).Equals(strColName));
            if (row != null)
            {
                string strDataType = Convert.ToString(row["DATA_TYPE"]);
                if (lstString.Contains(strDataType))
                {
                    rsl = DataType.STRING;
                }
                if (lstNumber.Contains(strDataType))
                {
                    rsl = DataType.NUMBER;
                }
                if (lstGuid.Contains(strDataType))
                {
                    rsl = DataType.GUID;
                }
                if (lstBoolean.Contains(strDataType))
                {
                    rsl = DataType.BOOLEAN;
                }
                if (lstDate.Contains(strDataType))
                {
                    rsl = DataType.DATE;
                }
            }
            return rsl;
        }

        private void button1_Click(object sender, EventArgs e)
        {
            string strTableName = txtTableName.Text.Trim();
            if (string.IsNullOrEmpty(strTableName))
            {
                MessageBox.Show(this, "Vui lòng nhập tên Table để tiếp tục!", "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }
            var dtbRsl = new DataTable("RSL");
            using (var conn = new SqlConnection(ConnectionString))
            {
                string query = @"select *
                                from INFORMATION_SCHEMA.COLUMNS
                                where TABLE_NAME='" + strTableName + "'";
                SqlCommand cmd = new SqlCommand(query, conn);
                SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                adapter.Fill(dtbRsl);
            }

            if (dtbRsl != null && dtbRsl.Rows.Count > 0)
            {
                StringBuilder sb = new StringBuilder();
                string strModelName = txtModelName.Text.Trim();
                string txtClassName = string.IsNullOrEmpty(strModelName) ? strTableName : strModelName;
                sb.AppendFormat("export class {0} {{\r\n", txtClassName);
                foreach (DataRow row in dtbRsl.Rows)
                {
                    string strColName = Convert.ToString(row["COLUMN_NAME"]);
                    DataType dataType = DataType.NONE;
                    dataType = CheckDataType(strColName, dtbRsl);
                    switch (dataType)
                    {
                        case DataType.STRING:
                            if (strColName.EndsWith("Id"))
                            {
                                sb.Append(strColName.Trim() + "= \"-1\" ;\r\n");
                            }
                            else
                            {
                                sb.Append(strColName.Trim() + ": string;\r\n");
                            }

                            break;
                        case DataType.BOOLEAN:
                            sb.Append(strColName.Trim() + ": boolean;\r\n");
                            break;
                        case DataType.NUMBER:
                            if (strColName.EndsWith("Id"))
                            {
                                sb.Append(strColName.Trim() + " = -1;\r\n");
                            }
                            else
                            {
                                sb.Append(strColName.Trim() + ": number;\r\n");
                            }
                            break;
                        case DataType.GUID:
                            sb.Append(strColName.Trim() + ": Guid;\r\n");
                            break;
                        case DataType.DATE:
                            sb.Append(strColName.Trim() + ": Date;\r\n");
                            break;
                        default:
                            sb.Append(strColName.Trim() + ": any;\r\n");
                            break;
                    }
                }

                sb.Append("}");
                rtfRsl.Text = sb.ToString();
            }
            else
            {
                MessageBox.Show(this, "Không có thông tin table!", "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Warning);
            }
        }
    }
}
