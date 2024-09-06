export class CreateClassDto {
    class_name: string;
    change_interval?: string;
    change_amount?: number;
    last_invt?: number;
    selected_zps_id: string;
}

export class UpdateClassDto {
    change_interval?: string;
    change_amount?: number;
    last_invt?: number;
    selected_zps_id?: string;
}