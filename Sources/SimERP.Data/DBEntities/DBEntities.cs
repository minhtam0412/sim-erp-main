﻿using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace SimERP.Data.DBEntities
{
    public partial class DBEntities : DbContext
    {
        public DBEntities()
        {
        }

        public DBEntities(DbContextOptions<DBEntities> options)
            : base(options)
        {
        }

        public virtual DbSet<AttachFile> AttachFile { get; set; }
        public virtual DbSet<Country> Country { get; set; }
        public virtual DbSet<Customer> Customer { get; set; }
        public virtual DbSet<CustomerType> CustomerType { get; set; }
        public virtual DbSet<Fiscal> Fiscal { get; set; }
        public virtual DbSet<Function> Function { get; set; }
        public virtual DbSet<Message> Message { get; set; }
        public virtual DbSet<Module> Module { get; set; }
        public virtual DbSet<OptionSystem> OptionSystem { get; set; }
        public virtual DbSet<PackageUnit> PackageUnit { get; set; }
        public virtual DbSet<Page> Page { get; set; }
        public virtual DbSet<Permission> Permission { get; set; }
        public virtual DbSet<Product> Product { get; set; }
        public virtual DbSet<ProductCategory> ProductCategory { get; set; }
        public virtual DbSet<ProductVendor> ProductVendor { get; set; }
        public virtual DbSet<RefNo> RefNo { get; set; }
        public virtual DbSet<Role> Role { get; set; }
        public virtual DbSet<RolePermission> RolePermission { get; set; }
        public virtual DbSet<Tax> Tax { get; set; }
        public virtual DbSet<TokenRefresh> TokenRefresh { get; set; }
        public virtual DbSet<Unit> Unit { get; set; }
        public virtual DbSet<User> User { get; set; }
        public virtual DbSet<UserEditableData> UserEditableData { get; set; }
        public virtual DbSet<UserPermission> UserPermission { get; set; }
        public virtual DbSet<UserRole> UserRole { get; set; }
        public virtual DbSet<Vendor> Vendor { get; set; }
        public virtual DbSet<VendorType> VendorType { get; set; }

        // Unable to generate entity type for table 'dbo.FiscalStatus'. Please see the warning messages.

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseSqlServer("Data Source=192.168.1.8;Initial Catalog=SimERP;Persist Security Info=True;User ID=admin;Password=admin");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AttachFile>(entity =>
            {
                entity.HasKey(e => e.AttachId);

                entity.Property(e => e.AttachId).HasColumnName("AttachID");

                entity.Property(e => e.Desctiption).HasMaxLength(500);

                entity.Property(e => e.FileName)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.FileNameOriginal).HasMaxLength(250);

                entity.Property(e => e.FilePath)
                    .HasMaxLength(250)
                    .IsUnicode(false);

                entity.Property(e => e.FileSize).HasColumnType("numeric(18, 0)");

                entity.Property(e => e.FileTitle).HasMaxLength(250);

                entity.Property(e => e.KeyValue)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.OptionName)
                    .HasMaxLength(50)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Country>(entity =>
            {
                entity.Property(e => e.CountryId)
                    .HasMaxLength(10)
                    .IsUnicode(false)
                    .ValueGeneratedNever();

                entity.Property(e => e.CountryName)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.Property(e => e.SearchString)
                    .HasMaxLength(500)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Customer>(entity =>
            {
                entity.ToTable("Customer", "list");

                entity.Property(e => e.Address)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.Property(e => e.BankingName).HasMaxLength(250);

                entity.Property(e => e.BankingNotes).HasMaxLength(250);

                entity.Property(e => e.BankingNumber)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.CountryId)
                    .HasMaxLength(10)
                    .IsUnicode(false);

                entity.Property(e => e.CustomerCode)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.CustomerName)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.Property(e => e.CustomerTypeList)
                    .HasMaxLength(500)
                    .IsUnicode(false);

                entity.Property(e => e.DebtCeiling).HasColumnType("numeric(18, 2)");

                entity.Property(e => e.Email)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.FaxNumber)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Latitude).HasColumnType("numeric(18, 2)");

                entity.Property(e => e.Longitude).HasColumnType("numeric(18, 2)");

                entity.Property(e => e.PhoneNumber)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.RepresentativeAddress).HasMaxLength(250);

                entity.Property(e => e.RepresentativeEmail)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.RepresentativeName).HasMaxLength(250);

                entity.Property(e => e.RepresentativePhone)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.SearchString)
                    .HasMaxLength(4000)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<CustomerType>(entity =>
            {
                entity.ToTable("CustomerType", "list");

                entity.HasIndex(e => e.CustomerTypeCode)
                    .HasName("IX_CustomerCode")
                    .IsUnique();

                entity.Property(e => e.CustomerTypeCode)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.CustomerTypeName).HasMaxLength(250);

                entity.Property(e => e.IsActive)
                    .IsRequired()
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.Notes).HasMaxLength(250);

                entity.Property(e => e.SearchString)
                    .HasMaxLength(1000)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Fiscal>(entity =>
            {
                entity.Property(e => e.ClosePriceDate).HasColumnType("date");

                entity.Property(e => e.FiscalName)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.Property(e => e.FromDate).HasColumnType("date");

                entity.Property(e => e.Notes).HasMaxLength(4000);

                entity.Property(e => e.ToDate).HasColumnType("date");
            });

            modelBuilder.Entity<Function>(entity =>
            {
                entity.ToTable("Function", "sec");

                entity.Property(e => e.FunctionId)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .ValueGeneratedNever();

                entity.Property(e => e.FunctionName)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.Property(e => e.IsActive)
                    .IsRequired()
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.Notes).HasMaxLength(500);
            });

            modelBuilder.Entity<Message>(entity =>
            {
                entity.HasKey(e => new { e.Code, e.LangId });

                entity.Property(e => e.Code)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.LangId)
                    .HasMaxLength(5)
                    .IsUnicode(false);

                entity.Property(e => e.Messages)
                    .IsRequired()
                    .HasMaxLength(500);

                entity.Property(e => e.Notes).HasMaxLength(500);
            });

            modelBuilder.Entity<Module>(entity =>
            {
                entity.ToTable("Module", "sec");

                entity.Property(e => e.ModuleId).ValueGeneratedNever();

                entity.Property(e => e.IsActive)
                    .IsRequired()
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.ModuleName)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.Property(e => e.Notes).HasMaxLength(500);
            });

            modelBuilder.Entity<OptionSystem>(entity =>
            {
                entity.HasKey(e => e.OptionId);

                entity.Property(e => e.DataType)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Notes).HasMaxLength(250);

                entity.Property(e => e.OptionName)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.OptionType)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Value)
                    .IsRequired()
                    .HasMaxLength(500);
            });

            modelBuilder.Entity<PackageUnit>(entity =>
            {
                entity.ToTable("PackageUnit", "item");

                entity.Property(e => e.Notes).HasMaxLength(500);

                entity.Property(e => e.PackageUnitName).HasMaxLength(100);

                entity.Property(e => e.SearchString)
                    .HasMaxLength(2000)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Page>(entity =>
            {
                entity.ToTable("Page", "sec");

                entity.Property(e => e.ActionName)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.ControllerName)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.FormName)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.IsActive)
                    .IsRequired()
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.IsCheckSecurity)
                    .IsRequired()
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.Notes).HasMaxLength(500);

                entity.Property(e => e.PageName)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.Property(e => e.Parameter)
                    .HasMaxLength(250)
                    .IsUnicode(false);

                entity.Property(e => e.SearchString)
                    .HasMaxLength(2000)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Permission>(entity =>
            {
                entity.ToTable("Permission", "sec");

                entity.Property(e => e.FunctionId)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Product>(entity =>
            {
                entity.ToTable("Product", "item");

                entity.Property(e => e.Barcode)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.CreatedDate).HasDefaultValueSql("(getdate())");

                entity.Property(e => e.IsActive)
                    .IsRequired()
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.ItemType).HasDefaultValueSql("((1))");

                entity.Property(e => e.LargePhoto)
                    .HasMaxLength(250)
                    .IsUnicode(false);

                entity.Property(e => e.MadeIn)
                    .HasMaxLength(10)
                    .IsUnicode(false);

                entity.Property(e => e.Note).HasMaxLength(2000);

                entity.Property(e => e.PackageUnit).HasColumnType("numeric(18, 2)");

                entity.Property(e => e.Price).HasColumnType("numeric(18, 2)");

                entity.Property(e => e.ProductCategoryList)
                    .HasMaxLength(500)
                    .IsUnicode(false);

                entity.Property(e => e.ProductCode)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.ProductName)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.Property(e => e.ProductNameShort).HasMaxLength(250);

                entity.Property(e => e.ProductType).HasDefaultValueSql("((1))");

                entity.Property(e => e.PurchasePrice).HasColumnType("numeric(18, 2)");

                entity.Property(e => e.Rfid)
                    .HasColumnName("RFID")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.SearchString)
                    .HasMaxLength(4000)
                    .IsUnicode(false);

                entity.Property(e => e.StandardCost).HasColumnType("numeric(18, 2)");

                entity.Property(e => e.SupplierNotes).HasMaxLength(500);

                entity.Property(e => e.SupplierProductCode)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.SupplierProductName).HasMaxLength(250);

                entity.Property(e => e.TermCondition).HasMaxLength(2000);

                entity.Property(e => e.ThumbnailPhoto)
                    .HasMaxLength(250)
                    .IsUnicode(false);

                entity.Property(e => e.WeightUnit).HasColumnType("numeric(18, 2)");
            });

            modelBuilder.Entity<ProductCategory>(entity =>
            {
                entity.ToTable("ProductCategory", "item");

                entity.Property(e => e.ProductCategoryId).HasDefaultValueSql("(newid())");

                entity.Property(e => e.IsActive)
                    .IsRequired()
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.Notes).HasMaxLength(500);

                entity.Property(e => e.ParentListId)
                    .HasMaxLength(500)
                    .IsUnicode(false);

                entity.Property(e => e.ProductCategoryCode)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.ProductCategoryName)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.Property(e => e.SearchString).HasMaxLength(1000);
            });

            modelBuilder.Entity<ProductVendor>(entity =>
            {
                entity.HasKey(e => e.RowId);

                entity.ToTable("ProductVendor", "item");

                entity.Property(e => e.RowId).ValueGeneratedNever();

                entity.Property(e => e.IsActive)
                    .IsRequired()
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.Notes).HasMaxLength(500);

                entity.Property(e => e.Price).HasColumnType("numeric(18, 2)");
            });

            modelBuilder.Entity<RefNo>(entity =>
            {
                entity.HasKey(e => e.RowId);

                entity.Property(e => e.RowId).ValueGeneratedNever();

                entity.Property(e => e.FormateString).HasMaxLength(10);

                entity.Property(e => e.Notes).HasMaxLength(250);

                entity.Property(e => e.RRefType).HasColumnName("rRefType");

                entity.Property(e => e.RefType)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.SequenceName)
                    .HasMaxLength(150)
                    .IsUnicode(false);

                entity.Property(e => e.SqlQueryRefNo)
                    .HasMaxLength(2000)
                    .IsUnicode(false);

                entity.Property(e => e.SqlQueryRefNoSql)
                    .HasColumnName("SqlQueryRefNoSQL")
                    .HasMaxLength(2000)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Role>(entity =>
            {
                entity.ToTable("Role", "sec");

                entity.Property(e => e.Notes).HasMaxLength(500);

                entity.Property(e => e.RoleCode)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.RoleName)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.Property(e => e.SearchString)
                    .HasMaxLength(4000)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<RolePermission>(entity =>
            {
                entity.ToTable("RolePermission", "sec");
            });

            modelBuilder.Entity<Tax>(entity =>
            {
                entity.ToTable("Tax", "item");

                entity.Property(e => e.Notes).HasMaxLength(500);

                entity.Property(e => e.SearchString)
                    .HasMaxLength(1000)
                    .IsUnicode(false);

                entity.Property(e => e.TaxCode)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.TaxName)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.Property(e => e.TaxPercent).HasColumnType("numeric(18, 2)");
            });

            modelBuilder.Entity<TokenRefresh>(entity =>
            {
                entity.Property(e => e.Id)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasDefaultValueSql("(newid())");

                entity.Property(e => e.CreatedDate)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.ModifedDate)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.Refreshtoken)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.Revoked).HasDefaultValueSql("((0))");

                entity.Property(e => e.Username)
                    .HasMaxLength(50)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Unit>(entity =>
            {
                entity.ToTable("Unit", "item");

                entity.Property(e => e.Notes).HasMaxLength(500);

                entity.Property(e => e.SearchString)
                    .HasMaxLength(2000)
                    .IsUnicode(false);

                entity.Property(e => e.UnitCode)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.UnitName)
                    .IsRequired()
                    .HasMaxLength(50);
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("User", "acc");

                entity.Property(e => e.Address).HasMaxLength(250);

                entity.Property(e => e.AdminCode)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Avatar)
                    .HasMaxLength(250)
                    .IsUnicode(false);

                entity.Property(e => e.Birthday).HasColumnType("date");

                entity.Property(e => e.Email)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.FullName)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.Property(e => e.PageDefault)
                    .HasMaxLength(250)
                    .IsUnicode(false);

                entity.Property(e => e.Password)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.PasswordExpire).HasColumnType("date");

                entity.Property(e => e.PhoneNumber)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.SearchString)
                    .HasMaxLength(2000)
                    .IsUnicode(false);

                entity.Property(e => e.SecondPassword)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.SignatureImage)
                    .HasMaxLength(250)
                    .IsUnicode(false);

                entity.Property(e => e.SystemLanguage)
                    .HasMaxLength(5)
                    .IsUnicode(false);

                entity.Property(e => e.UserCode)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.UserName)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<UserEditableData>(entity =>
            {
                entity.HasKey(e => e.RowId);

                entity.ToTable("UserEditableData", "sec");

                entity.Property(e => e.OwnerListId).IsUnicode(false);
            });

            modelBuilder.Entity<UserPermission>(entity =>
            {
                entity.ToTable("UserPermission", "sec");
            });

            modelBuilder.Entity<UserRole>(entity =>
            {
                entity.ToTable("UserRole", "sec");
            });

            modelBuilder.Entity<Vendor>(entity =>
            {
                entity.ToTable("Vendor", "list");

                entity.Property(e => e.Address).HasMaxLength(250);

                entity.Property(e => e.FaxNumber)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.PhoneNumber)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.SearchString)
                    .HasMaxLength(1000)
                    .IsUnicode(false);

                entity.Property(e => e.VendorCode)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.VendorName)
                    .IsRequired()
                    .HasMaxLength(250);
            });

            modelBuilder.Entity<VendorType>(entity =>
            {
                entity.ToTable("VendorType", "list");

                entity.Property(e => e.IsActive)
                    .IsRequired()
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.Notes).HasMaxLength(250);

                entity.Property(e => e.SearchString)
                    .HasMaxLength(1000)
                    .IsUnicode(false);

                entity.Property(e => e.VendorTypeCode)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.VendorTypeName)
                    .IsRequired()
                    .HasMaxLength(250);
            });
        }
    }
}