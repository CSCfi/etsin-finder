"""Validation schemas for form data coming in from Qvain Light"""
from marshmallow import Schema, fields, validates_schema, ValidationError
from marshmallow.validate import Length, OneOf
import json
from etsin_finder.qvain_light_dataset_schema import (
    PersonValidationSchema,
    OrganizationValidationSchema,
    ActorValidationSchema,
    DatasetValidationSchema as DatasetValidationSchemaV1,
    DatasetValidationSchemaForDraft as DatasetValidationSchemaForDraftV1
)

class DatasetValidationSchema(DatasetValidationSchemaV1):
    """Validation schema for the whole dataset."""

    class Meta:
        """Meta options for validation."""

        exclude = ("files", "directories")

class DatasetValidationSchemaForDraft(DatasetValidationSchemaForDraftV1):
    """Validation schema for the whole dataset when in draft format."""

    class Meta:
        """Meta options for validation."""

        exclude = ("files", "directories")


class FileActionSchema(Schema):
    """Validation schema for a file or directory addition/removal."""

    identifier = fields.Str(required=True)
    exclude = fields.Boolean()

class FileActionsValidationSchema(Schema):
    """Validation schema for file and directory additions/removals."""

    files = fields.List(fields.Nested(FileActionSchema))
    directories = fields.List(fields.Nested(FileActionSchema))


class FileMetadataSchema(Schema):
    """Validation schema for file metadata changes."""

    identifier = fields.Str(required=True)
    title = fields.Str()
    description = fields.Str()
    use_category = fields.Dict()
    file_type = fields.Dict()
    delete = fields.Boolean()

    @validates_schema
    def require_if_check_required(self, data, **kwargs):
        """Require fields only if not deleting metadata"""
        if not data.get('delete'):
            for field in ['title', 'description', 'use_category']:
                if data.get(field) is None:
                    raise ValidationError('Missing required field', field_name=field)

class DirectoryMetadataSchema(Schema):
    """Validation schema for directory metadata changes."""

    identifier = fields.Str(required=True)
    title = fields.Str()
    description = fields.Str()
    use_category = fields.Dict()
    delete = fields.Boolean()

    @validates_schema
    def require_if_check_required(self, data, **kwargs):
        """Require fields only if not deleting metadata"""
        if not data.get('delete'):
            for field in ['title', 'use_category']:
                if data.get(field) is None:
                    raise ValidationError('Missing required field', field_name=field)

class UserMetadataValidationSchema(Schema):
    """Validation schema for dataset-specific file and directory metadata changes."""

    files = fields.List(fields.Nested(FileMetadataSchema))
    directories = fields.List(fields.Nested(DirectoryMetadataSchema))
