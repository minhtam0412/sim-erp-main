using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using SimERP.Data.DBEntities;

/*
 * Creator: Trưc.Trương
 * Created Date: 09/09/2019
 * Description: Base class
 */
namespace SimERP.Data
{
    /// <summary>
    /// Repository class: Contain basic functions
    /// </summary>
    /// <typeparam name="T">Object</typeparam>
    public interface IRepository<T> where T : class, new()
    {
        #region Get Data

        /// <summary>
        /// Get list items
        /// </summary>
        /// <param name="navigationProperties"></param>
        /// <returns>List items/Null</returns>
        IList<T> GetAll(params Expression<Func<T, object>>[] navigationProperties);

        /// <summary>
        /// Get list items
        /// </summary>
        /// <param name="navigationProperties"></param>
        /// <param name="startRow">start row</param>
        /// <param name="maxRows">max row</param>
        /// <returns></returns>
        IList<T> GetAll(int startRow, int maxRows, params Expression<Func<T, object>>[] navigationProperties);

        /// <summary>
        /// Get list items by conditions
        /// </summary>
        /// <param name="where">Where conditions</param>
        /// <param name="navigationProperties"></param>
        /// <returns>List items/Null</returns>
        IList<T> GetList(Func<T, bool> where, params Expression<Func<T, object>>[] navigationProperties);

        /// <summary>
        /// Get list itmes by condition
        /// </summary>
        /// <param name="where"></param>
        /// <param name="navigationProperties"></param>
        /// <param name="startRow">start row</param>
        /// <param name="maxRow">max row</param>
        /// <returns></returns>
        IList<T> GetList(int startRow, int maxRows, Func<T, bool> where, params Expression<Func<T, object>>[] navigationProperties);

        /// <summary>
        /// Get item by defualt
        /// </summary>
        /// <param name="where">Where conditions</param>
        /// <param name="navigationProperties"></param>
        /// <returns>Item/Null</returns>
        T GetSingle(Func<T, bool> where, params Expression<Func<T, object>>[] navigationProperties);

        /// <summary>
        /// Get item 
        /// </summary>
        /// <param name="ID">Item ID</param>
        /// <returns>Item/Null</returns>
        T GetByID(object ID);

        /// <summary>
        /// Get message by message Code
        /// </summary>
        /// <param name="Code">Message Code</param>
        /// <returns>Return message</returns>
        string GetMessage(string Code, string Lang);

        /// <summary>
        /// Get current message
        /// </summary>
        /// <returns>Return message</returns>
        string GetMessage();

        /// <summary>
        /// Add message
        /// </summary>
        /// <param name="Code">Message Code</param>
        /// <param name="Message">Message text</param>
        void AddMessage(string Code, string Message, string ErrorCode = "");

        string getMsgCode();

        string getMessage();

        string getErrorCode();

        int GetMaxSortOrder(Func<T, int> columnSelector);

        #endregion

        #region Insert, Update, Delete

        /// <summary>
        /// Add new item
        /// </summary>
        /// <param name="item">Item</param>
        /// <returns>True/False</returns>
        bool Add(T item);

        /// <summary>
        /// Add new multi items
        /// </summary>
        /// <param name="items">List items</param>
        /// <returns>True/False</returns>
        bool Add(List<T> items);

        /// <summary>
        /// Update item
        /// </summary>
        /// <param name="item">item</param>
        /// <returns>True/False</returns>
        bool Update(T item);

        /// <summary>
        /// Update multi items
        /// </summary>
        /// <param name="items">List items</param>
        /// <returns>True/False</returns>
        bool Update(List<T> items);

        /// <summary>
        /// Delete itme by ID
        /// </summary>
        /// <param name="ID">Item ID</param>
        /// <returns>True/False</returns>
        bool Delete(object ID);

        /// <summary>
        /// Delete multi 
        /// </summary>
        /// <param name="items">List Items</param>
        /// <returns>True/False</returns>
        bool Delete(List<T> items);

        #endregion

        #region Get & set

        Fiscal GetCurrentFiscal();
        int TotalRows { get; set; }
        string LangID { get; set; }
        string GetFullNameByUserID(Guid userID);
        decimal GetCurrentBalanceAmount(int storeID, Guid objID, int objType);
        string GetOptionSystemByID(string OptionID);
        string GetOptionSystemByID(int storeID, string OptionID);
        bool GetOptionSystemByValue(string OptionID);
        bool GetOptionSystemByValue(int storeID, string OptionID);

        #endregion

        #region Generate RefNo

        string GetRefNoCode(int storeID, string refType, DateTime voucherDate);
        string GetRefNoCode(int storeID, string refType, DateTime voucherDate, ref long currNumber);
        string GetNextRefNo(int storeID, string refType);

        #endregion
    }
}