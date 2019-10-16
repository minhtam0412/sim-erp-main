﻿using SimERP.Business.Models.MasterData.ListDTO;
using SimERP.Data;
using SimERP.Data.DBEntities;
using System.Collections.Generic;

namespace SimERP.Business.Interfaces.List
{
    public interface IVendor : IRepository<Vendor>
    {
        List<Vendor> GetData(ReqListSearch reqListSearch);

        bool Save(Vendor rowData, bool isNew);

        bool DeleteVendorType(int id);

        bool UpdateSortOrder(int upID, int downID);
    }
}