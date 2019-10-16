/*
 * Author: Truc.Truong
 * Created Date: 10/09/2019
 * Description: Write log file
 */

using System;
using log4net;
using log4net.Config;

namespace SimERP.Business
{
    public static class Logger
    {
        #region Variables

        private static ILog _log;

        #endregion

        #region Constructor

        static Logger()
        {
            XmlConfigurator.Configure();
            _log = LogManager.GetLogger("");
        }

        #endregion

        #region Info

        public static void Info(object message)
        {
            _log.Info(message);
        }

        public static void Info(string message, Exception ex)
        {
            _log.Info(message, ex);
        }

        public static void InfoFormat(string format, params object[] arg)
        {
            _log.InfoFormat(format, arg);
        }

        /// <summary>
        /// Write log with class name
        /// </summary>
        /// <param name="type">GetType()</param>
        /// <param name="message"></param>
        public static void Info(Type type, object message)
        {
            Info(GetTypeName(type) + message);
        }

        /// <summary>
        /// Write log with class name
        /// </summary>
        /// <param name="type">GetType()</param>
        /// <param name="message">Message</param>
        /// <param name="ex">Excetion</param>
        public static void Info(Type type, object message, Exception ex)
        {
            Info((GetTypeName(type) + message), ex);
        }

        /// <summary>
        /// Write log with class name
        /// </summary>
        /// <param name="type">GetType()</param>
        /// <param name="format">Format Message</param>
        /// <param name="arg"></param>
        public static void InfoFormat(Type type, string format, params object[] arg)
        {
            InfoFormat(GetTypeName(type) + format, arg);
        }

        #endregion

        #region Debug

        public static void Debug(object message)
        {
            _log.Debug(message);
        }

        public static void Debug(string message, Exception ex)
        {
            _log.Debug(message, ex);
        }

        public static void DebugFormat(string format, params object[] arg)
        {
            _log.DebugFormat(format, arg);
        }

        /// <summary>
        /// Write log with class name
        /// </summary>
        /// <param name="type">GetType()</param>
        /// <param name="message"></param>
        public static void Debug(Type type, object message)
        {
            Debug(GetTypeName(type) + message);
        }

        /// <summary>
        /// Write log with class name
        /// </summary>
        /// <param name="type">GetType()</param>
        /// <param name="message">Message</param>
        /// <param name="ex">Excetion</param>
        public static void Debug(Type type, object message, Exception ex)
        {
            Debug((GetTypeName(type) + message), ex);
        }

        /// <summary>
        /// Write log with class name
        /// </summary>
        /// <param name="type">GetType()</param>
        /// <param name="format">Format Message</param>
        /// <param name="arg"></param>
        public static void DebugFormat(Type type, string format, params object[] arg)
        {
            DebugFormat(GetTypeName(type) + format, arg);
        }

        #endregion

        #region Error

        public static void Error(object message)
        {
            _log.Error(message);
        }

        public static void Error(string message, Exception ex)
        {
            _log.Error(message, ex);
        }

        public static void ErrorFormat(string format, params object[] arg)
        {
            _log.ErrorFormat(format, arg);
        }

        /// <summary>
        /// Write log with class name
        /// </summary>
        /// <param name="type">GetType()</param>
        /// <param name="message"></param>
        public static void Error(Type type, object message)
        {
            Error(GetTypeName(type) + message);
        }

        /// <summary>
        /// Write log with class name
        /// </summary>
        /// <param name="type">GetType()</param>
        /// <param name="message">Message</param>
        /// <param name="ex">Excetion</param>
        public static void Error(Type type, object message, Exception ex)
        {
            Error((GetTypeName(type) + message), ex);
        }

        /// <summary>
        /// Write log with class name
        /// </summary>
        /// <param name="type">GetType()</param>
        /// <param name="format">Format Message</param>
        /// <param name="arg"></param>
        public static void ErrorFormat(Type type, string format, params object[] arg)
        {
            ErrorFormat(GetTypeName(type) + format, arg);
        }

        #endregion

        #region Fatal

        public static void Fatal(object message)
        {
            _log.Fatal(message);
        }

        public static void Fatal(string message, Exception ex)
        {
            _log.Fatal(message, ex);
        }

        public static void FatalFormat(string format, params object[] arg)
        {
            _log.FatalFormat(format, arg);
        }

        /// <summary>
        /// Write log with class name
        /// </summary>
        /// <param name="type">GetType()</param>
        /// <param name="message"></param>
        public static void Fatal(Type type, object message)
        {
            Fatal(GetTypeName(type) + message);
        }

        /// <summary>
        /// Write log with class name
        /// </summary>
        /// <param name="type">GetType()</param>
        /// <param name="message">Message</param>
        /// <param name="ex">Excetion</param>
        public static void Fatal(Type type, object message, Exception ex)
        {
            Fatal((GetTypeName(type) + message), ex);
        }

        /// <summary>
        /// Write log with class name
        /// </summary>
        /// <param name="type">GetType()</param>
        /// <param name="format">Format Message</param>
        /// <param name="arg"></param>
        public static void FatalFormat(Type type, string format, params object[] arg)
        {
            FatalFormat(GetTypeName(type) + format, arg);
        }

        #endregion

        #region Private methods

        private static string GetTypeName(Type type)
        {
            string className = string.Empty;
            if (type != null)
                className = type.FullName + ": ";
            return className;
        }

        #endregion
    }
}