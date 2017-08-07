CREATE TABLE [dbo].[CheckListItem]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY, 
    [Description] VARCHAR(100) NULL, 
    [CheckListId] INT NOT NULL, 
    [IsComplete] BIT NULL, 
    [CreateDate] DATETIME NULL, 
    [EndDate] DATETIME NULL
)
