using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SimERP.Business.Models.MasterData.ListDTO;
using SimERP.Data;
using SimERP.Data.DBEntities;
using AttachFile = SimERP.Business.Models.MasterData.ListDTO.AttachFile;

namespace SimERP.Business.Interfaces.List
{
    public interface IAttachFile : IRepository<AttachFile>
    {
        List<AttachFile> GetData(ReqListSearch reqListSearch);
        bool Save(AttachFile attachFile, bool isNew);
        bool Delete(int id);
    }
}