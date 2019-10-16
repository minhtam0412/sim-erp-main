namespace SimERP.Business
{
    /// <summary>
    /// Respone Result
    /// </summary>
    public class ResponeResult
    {
        public bool IsOk { get; set; } = true;
        public string MessageCode { get; set; }
        public string MessageText { get; set; }
        public string MessageError { get; set; }
        public dynamic RepData { get; set; }
        public int TotalRow { get; set; }
    }
}