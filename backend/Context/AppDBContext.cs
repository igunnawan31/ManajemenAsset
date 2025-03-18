using System.Globalization;
using Microsoft.EntityFrameworkCore;
using qrmanagement.backend.Models;

namespace qrmanagement.backend.Context{
    public class AppDBContext : DbContext{
        public AppDBContext(DbContextOptions<AppDBContext> options) : base(options)
        { }

        public DbSet<Asset> Assets {get; set;}
        public DbSet<AssetMove> AssetMoves {get; set;}
        public DbSet<Branch> Branches {get; set;}
        public DbSet<Ticket> Tickets {get; set;}
        public DbSet<User> Users {get; set;}
        public DbSet<Kota> Kotas {get; set;}
        public DbSet<Kecamatan> Kecamatans {get; set;}

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Kota>(entity => {
                entity.HasKey(a => a.kotaId);
                
                entity.HasMany(a => a.kecamatans)
                    .WithOne(a => a.kecamatanKota)
                    .HasForeignKey(a => a.kotaId);
                
                entity.HasData(
                    new Kota{kotaId = 1, kotaName = "Jakarta Utara"},
                    new Kota{kotaId = 2, kotaName = "Jakarta Pusat"}
                );
            });

            modelBuilder.Entity<Kecamatan>(entity => {
                entity.HasKey(a => a.kecamatanId);

                entity.HasOne(a => a.kecamatanKota)
                    .WithMany(a => a.kecamatans)
                    .HasForeignKey(a => a.kotaId);

                entity.HasData(
                    new Kecamatan{kecamatanId = 1, kecamatanName = "Tanjung Priok", kotaId=1},
                    new Kecamatan{kecamatanId = 2, kecamatanName = "Senen", kotaId=2}
                );
            });

            modelBuilder.Entity<Branch>(entity => {
                entity.HasKey(a => a.branchId);
                entity.Property(a => a.parentId)
                        .IsRequired(false);

                entity.HasMany(a => a.assets)
                    .WithOne(a => a.branch)
                    .HasForeignKey(a => a.locationId);
                
                entity.HasMany(a => a.users)
                    .WithOne(a => a.branch)
                    .HasForeignKey(a => a.userBranch);

                entity.HasOne(a => a.branchKota)
                    .WithMany(a => a.Branches)
                    .HasForeignKey(a => a.kotaId)
                    .OnDelete(DeleteBehavior.NoAction);

                entity.HasOne(a => a.branchKecamatan)
                    .WithMany(a => a.Branches)
                    .HasForeignKey(a => a.branchId)
                    .OnDelete(DeleteBehavior.NoAction);

                entity.HasData(
                    new Branch{branchId = 1, branchName = "Astra International", branchEmail = "astraInternational@ai.astra.co.id", branchPhone = "1234567890123", branchLocation = "Jakarta Utara", parentId = null, kecamatanId=1, kotaId=1},
                    new Branch{branchId = 2, branchName = "Astragraphia Information Technology", branchEmail = "ag.it@ai.astra.co.id", branchPhone = "1234567890321", branchLocation = "Jakarta Pusat", parentId = 1, kecamatanId=2, kotaId=2}
                );
            });

            modelBuilder.Entity<Asset>(entity => {
                entity.HasKey(a => a.id);
                entity.Property(a => a.assetType)
                        .HasConversion<string>();
                entity.Property(a => a.itemStatus)
                        .HasConversion<string>();

                entity.HasMany(a => a.assetMoves)
                    .WithOne(a => a.asset)
                    .HasForeignKey(a => a.assetNumber);

                entity.HasOne(a => a.branch)
                    .WithMany(a => a.assets)
                    .HasForeignKey(a => a.locationId);

                entity.HasData(
                    new Asset{id = "AN-001-070225", name = "Samsung_Galaxy", locationId = 2, assetType = assetType.Electronics, itemStatus = managementStatus.Active, imagePath = ""},
                    new Asset{id = "AN-002-070225", name = "Samsung_Flip", locationId = 1, assetType = assetType.Electronics, itemStatus = managementStatus.Active, imagePath = ""}
                );
            });

            modelBuilder.Entity<Ticket>(entity => {
                entity.HasKey(a => a.ticketNumber);
                entity.Property(a => a.approvalStatus)
                        .HasConversion<string>();
                entity.Property(a => a.moveStatus)
                        .HasConversion<string>();

                entity.HasMany(a => a.assetMoves)
                    .WithOne(a => a.ticket)
                    .HasForeignKey(a => a.ticketNumber);

                entity.HasOne(t => t.origin)
                    .WithMany(b => b.outbounds)
                    .HasForeignKey(t => t.branchOrigin)
                    .OnDelete(DeleteBehavior.NoAction);

                entity.HasOne(t => t.destination)
                    .WithMany(b => b.inbounds)
                    .HasForeignKey(t => t.branchDestination)
                    .OnDelete(DeleteBehavior.NoAction); 
                
                entity.HasData(
                    new Ticket{ticketNumber = "TN-001-070225", branchOrigin = 1, branchDestination = 2, outboundDate = DateOnly.ParseExact("01-02-2025", "d-M-yyyy", CultureInfo.InvariantCulture), inboundDate = DateOnly.ParseExact("05-02-2025", "d-M-yyyy", CultureInfo.InvariantCulture), dateRequested = DateOnly.ParseExact("28-01-2025", "d-M-yyyy", CultureInfo.InvariantCulture), approvalStatus = approvalStatus.Approved, moveStatus = moveStatus.Completed, dateApproved = DateOnly.ParseExact("30-01-2025", "d-M-yyyy", CultureInfo.InvariantCulture)},
                    new Ticket{ticketNumber = "TN-002-070225", branchOrigin = 2, branchDestination = 1, outboundDate = DateOnly.ParseExact("01-02-2025", "d-M-yyyy", CultureInfo.InvariantCulture), inboundDate = DateOnly.ParseExact("05-02-2025", "d-M-yyyy", CultureInfo.InvariantCulture), dateRequested = DateOnly.ParseExact("28-01-2025", "d-M-yyyy", CultureInfo.InvariantCulture), approvalStatus = approvalStatus.Approved, moveStatus = moveStatus.Completed, dateApproved = DateOnly.ParseExact("30-01-2025", "d-M-yyyy", CultureInfo.InvariantCulture)}
                );
            });

            modelBuilder.Entity<AssetMove>(entity => {
                entity.HasKey(a => a.id);
                entity.Property(a => a.moveStatus)
                        .HasConversion<string>();

                entity.HasOne(a => a.asset)
                    .WithMany(a => a.assetMoves)
                    .HasForeignKey(a => a.assetNumber);

                entity.HasOne(a => a.ticket)
                    .WithMany(a => a.assetMoves)
                    .HasForeignKey(a => a.ticketNumber);

                entity.HasData(
                    new AssetMove{id = 1, ticketNumber = "TN-001-070225", assetNumber = "AN-001-070225", moveStatus = MoveStatus.Completed},
                    new AssetMove{id = 2, ticketNumber = "TN-002-070225", assetNumber = "AN-002-070225", moveStatus = MoveStatus.Completed}
                );
            });

            modelBuilder.Entity<User>(entity => {
                entity.HasKey(a => a.userId);
                entity.HasIndex(a => a.userEmail).IsUnique();

                entity.HasOne(a => a.branch)
                    .WithMany(a => a.users)
                    .HasForeignKey(a => a.userBranch);

                entity.HasData(
                    new User{userId = 1, userName = "Gunawan", userEmail = "mgunawan@ai.astra.co.id", userBranch = 1, userPhone = "1234567890456", userRole = Role.Pusat, userSubRole = SubRole.Kepala_Gudang, password = "12345"},
                    new User{userId = 2, userName = "MGunawan", userEmail = "gunawan@ai.astra.co.id", userBranch = 1, userPhone = "1234567890654", userRole = Role.Pusat, userSubRole = SubRole.PIC_Gudang, password = "12345"},
                    new User{userId = 3, userName = "Aldisar", userEmail = "aldisar@ai.astra.co.id", userBranch = 2, userPhone = "1234567890789", userRole = Role.Cabang, userSubRole = SubRole.Kepala_Gudang, password = "12345"},
                    new User{userId = 4, userName = "Gibran", userEmail = "gibran@ai.astra.co.id", userBranch = 2, userPhone = "1234567890987", userRole = Role.Cabang, userSubRole = SubRole.PIC_Gudang, password = "12345"}
                );
            });
        }
    }
}