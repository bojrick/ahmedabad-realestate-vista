export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      gujrera_projects_detailed_summary: {
        Row: {
          acquisitioncostoflanda: number | null
          acquisitioncostoflandb: number | null
          acquisitioncostoftdra: number | null
          acquisitioncostoftdrb: number | null
          actualcostofconstructincurredandpaidb: number | null
          airportdistance: number | null
          amountofpremiumpayablea: number | null
          amountofpremiumpayableb: number | null
          amountspayabletostategovernmenta: number | null
          amountspayabletostategovernmentb: number | null
          amttobedepositedindesigacc: number | null
          amtwithdrawnfromdesigaccount: number | null
          amtwithdrawntilldateofthiscerti: number | null
          architect_address: string | null
          architect_name: string | null
          architect_no_projects: number | null
          architect_prof_experience: number | null
          archscore: string | null
          area_booking_percentage: number | null
          areaofgarageforsale: number | null
          areaofparkinfforsale: number | null
          balamtofreceivablesfrombookedaptmnts: number | null
          balunbookedareatobecerti: number | null
          booked_balcony_area: number | null
          booked_carpet_area: number | null
          booked_flats: number | null
          booked_received_amount: number | null
          booked_unit_consideration: number | null
          booking_percentage: number | null
          completiondate: string | null
          coveredparking: number | null
          coveredparkingarea: number | null
          data_updated_at: string | null
          distname: string | null
          eng_address: string | null
          eng_name: string | null
          eng_no_projects: number | null
          eng_prof_experience: number | null
          enggscore: string | null
          estamtofsalesproceedsinrespectofunbookedaptmnts: number | null
          estbalcosttocompleteproject: number | null
          estcostofconstructascertifybyenga: number | null
          estreceivablesofongoingproject: number | null
          flat_total_units: number | null
          formoneid: number | null
          formthreeid: number | null
          formtwoid: number | null
          interestpayabletofinancea: number | null
          interestpayabletofinanceb: number | null
          landpremiumpayablea: number | null
          landpremiumpayableb: number | null
          last_sale_date: string | null
          location_coordinates: string | null
          location_status: string | null
          methodlandvaluation: string | null
          moje: string | null
          netamtwithdrawfromdesigbnkaccundercerti: number | null
          noofgarageforsale: number | null
          noofinventory: number | null
          noofparkinfforsale: number | null
          office_total_balcony_area: number | null
          office_total_carpet_area: number | null
          office_total_received_amount: number | null
          office_total_unit_consideration: number | null
          office_total_units: number | null
          officename: string | null
          onsiteexpenditurefordevelopmenta: number | null
          onsiteexpenditurefordevelopmentb: number | null
          openparkingarea: number | null
          other_total_units: number | null
          payment_collection_percentage: number | null
          paymentoftaxesa: number | null
          paymentoftaxesb: number | null
          pincode: string | null
          place: string | null
          plot_total_units: number | null
          processtype: string | null
          projectaddress: string | null
          projectaddress2: string | null
          projectapprovedate: string | null
          projectdesc: string | null
          projectname: string | null
          projectprogress: string | null
          projectregid: number
          projectstatus: string | null
          projecttype: string | null
          promotername: string | null
          promotertype: string | null
          rerasubmissiondate: string | null
          residential_total_balcony_area: number | null
          residential_total_carpet_area: number | null
          residential_total_received_amount: number | null
          residential_total_unit_consideration: number | null
          residential_total_units: number | null
          score: string | null
          shop_total_balcony_area: number | null
          shop_total_carpet_area: number | null
          shop_total_received_amount: number | null
          shop_total_unit_consideration: number | null
          shop_total_units: number | null
          startdate: string | null
          subtotaloflandcosta: number | null
          subtotofdevelopcosta: number | null
          subtotofdevelopcostb: number | null
          timelaps: string | null
          total_balcony_area: number | null
          total_builtup_area: number | null
          total_carpet_area: number | null
          total_received_amount: number | null
          total_unit_consideration: number | null
          total_units: number | null
          totalcostincurredandpaid: number | null
          totalestimatedcostoftherealestateproject: number | null
          totareaofland: number | null
          totcarpetareaforprojectunderreg: number | null
          totcoverdarea: number | null
          totlandareaforprojectunderreg: number | null
          totopenarea: number | null
          tpname: string | null
          tpno: string | null
          tpo_code: string | null
          underredevelopment: string | null
        }
        Insert: {
          acquisitioncostoflanda?: number | null
          acquisitioncostoflandb?: number | null
          acquisitioncostoftdra?: number | null
          acquisitioncostoftdrb?: number | null
          actualcostofconstructincurredandpaidb?: number | null
          airportdistance?: number | null
          amountofpremiumpayablea?: number | null
          amountofpremiumpayableb?: number | null
          amountspayabletostategovernmenta?: number | null
          amountspayabletostategovernmentb?: number | null
          amttobedepositedindesigacc?: number | null
          amtwithdrawnfromdesigaccount?: number | null
          amtwithdrawntilldateofthiscerti?: number | null
          architect_address?: string | null
          architect_name?: string | null
          architect_no_projects?: number | null
          architect_prof_experience?: number | null
          archscore?: string | null
          area_booking_percentage?: number | null
          areaofgarageforsale?: number | null
          areaofparkinfforsale?: number | null
          balamtofreceivablesfrombookedaptmnts?: number | null
          balunbookedareatobecerti?: number | null
          booked_balcony_area?: number | null
          booked_carpet_area?: number | null
          booked_flats?: number | null
          booked_received_amount?: number | null
          booked_unit_consideration?: number | null
          booking_percentage?: number | null
          completiondate?: string | null
          coveredparking?: number | null
          coveredparkingarea?: number | null
          data_updated_at?: string | null
          distname?: string | null
          eng_address?: string | null
          eng_name?: string | null
          eng_no_projects?: number | null
          eng_prof_experience?: number | null
          enggscore?: string | null
          estamtofsalesproceedsinrespectofunbookedaptmnts?: number | null
          estbalcosttocompleteproject?: number | null
          estcostofconstructascertifybyenga?: number | null
          estreceivablesofongoingproject?: number | null
          flat_total_units?: number | null
          formoneid?: number | null
          formthreeid?: number | null
          formtwoid?: number | null
          interestpayabletofinancea?: number | null
          interestpayabletofinanceb?: number | null
          landpremiumpayablea?: number | null
          landpremiumpayableb?: number | null
          last_sale_date?: string | null
          location_coordinates?: string | null
          location_status?: string | null
          methodlandvaluation?: string | null
          moje?: string | null
          netamtwithdrawfromdesigbnkaccundercerti?: number | null
          noofgarageforsale?: number | null
          noofinventory?: number | null
          noofparkinfforsale?: number | null
          office_total_balcony_area?: number | null
          office_total_carpet_area?: number | null
          office_total_received_amount?: number | null
          office_total_unit_consideration?: number | null
          office_total_units?: number | null
          officename?: string | null
          onsiteexpenditurefordevelopmenta?: number | null
          onsiteexpenditurefordevelopmentb?: number | null
          openparkingarea?: number | null
          other_total_units?: number | null
          payment_collection_percentage?: number | null
          paymentoftaxesa?: number | null
          paymentoftaxesb?: number | null
          pincode?: string | null
          place?: string | null
          plot_total_units?: number | null
          processtype?: string | null
          projectaddress?: string | null
          projectaddress2?: string | null
          projectapprovedate?: string | null
          projectdesc?: string | null
          projectname?: string | null
          projectprogress?: string | null
          projectregid: number
          projectstatus?: string | null
          projecttype?: string | null
          promotername?: string | null
          promotertype?: string | null
          rerasubmissiondate?: string | null
          residential_total_balcony_area?: number | null
          residential_total_carpet_area?: number | null
          residential_total_received_amount?: number | null
          residential_total_unit_consideration?: number | null
          residential_total_units?: number | null
          score?: string | null
          shop_total_balcony_area?: number | null
          shop_total_carpet_area?: number | null
          shop_total_received_amount?: number | null
          shop_total_unit_consideration?: number | null
          shop_total_units?: number | null
          startdate?: string | null
          subtotaloflandcosta?: number | null
          subtotofdevelopcosta?: number | null
          subtotofdevelopcostb?: number | null
          timelaps?: string | null
          total_balcony_area?: number | null
          total_builtup_area?: number | null
          total_carpet_area?: number | null
          total_received_amount?: number | null
          total_unit_consideration?: number | null
          total_units?: number | null
          totalcostincurredandpaid?: number | null
          totalestimatedcostoftherealestateproject?: number | null
          totareaofland?: number | null
          totcarpetareaforprojectunderreg?: number | null
          totcoverdarea?: number | null
          totlandareaforprojectunderreg?: number | null
          totopenarea?: number | null
          tpname?: string | null
          tpno?: string | null
          tpo_code?: string | null
          underredevelopment?: string | null
        }
        Update: {
          acquisitioncostoflanda?: number | null
          acquisitioncostoflandb?: number | null
          acquisitioncostoftdra?: number | null
          acquisitioncostoftdrb?: number | null
          actualcostofconstructincurredandpaidb?: number | null
          airportdistance?: number | null
          amountofpremiumpayablea?: number | null
          amountofpremiumpayableb?: number | null
          amountspayabletostategovernmenta?: number | null
          amountspayabletostategovernmentb?: number | null
          amttobedepositedindesigacc?: number | null
          amtwithdrawnfromdesigaccount?: number | null
          amtwithdrawntilldateofthiscerti?: number | null
          architect_address?: string | null
          architect_name?: string | null
          architect_no_projects?: number | null
          architect_prof_experience?: number | null
          archscore?: string | null
          area_booking_percentage?: number | null
          areaofgarageforsale?: number | null
          areaofparkinfforsale?: number | null
          balamtofreceivablesfrombookedaptmnts?: number | null
          balunbookedareatobecerti?: number | null
          booked_balcony_area?: number | null
          booked_carpet_area?: number | null
          booked_flats?: number | null
          booked_received_amount?: number | null
          booked_unit_consideration?: number | null
          booking_percentage?: number | null
          completiondate?: string | null
          coveredparking?: number | null
          coveredparkingarea?: number | null
          data_updated_at?: string | null
          distname?: string | null
          eng_address?: string | null
          eng_name?: string | null
          eng_no_projects?: number | null
          eng_prof_experience?: number | null
          enggscore?: string | null
          estamtofsalesproceedsinrespectofunbookedaptmnts?: number | null
          estbalcosttocompleteproject?: number | null
          estcostofconstructascertifybyenga?: number | null
          estreceivablesofongoingproject?: number | null
          flat_total_units?: number | null
          formoneid?: number | null
          formthreeid?: number | null
          formtwoid?: number | null
          interestpayabletofinancea?: number | null
          interestpayabletofinanceb?: number | null
          landpremiumpayablea?: number | null
          landpremiumpayableb?: number | null
          last_sale_date?: string | null
          location_coordinates?: string | null
          location_status?: string | null
          methodlandvaluation?: string | null
          moje?: string | null
          netamtwithdrawfromdesigbnkaccundercerti?: number | null
          noofgarageforsale?: number | null
          noofinventory?: number | null
          noofparkinfforsale?: number | null
          office_total_balcony_area?: number | null
          office_total_carpet_area?: number | null
          office_total_received_amount?: number | null
          office_total_unit_consideration?: number | null
          office_total_units?: number | null
          officename?: string | null
          onsiteexpenditurefordevelopmenta?: number | null
          onsiteexpenditurefordevelopmentb?: number | null
          openparkingarea?: number | null
          other_total_units?: number | null
          payment_collection_percentage?: number | null
          paymentoftaxesa?: number | null
          paymentoftaxesb?: number | null
          pincode?: string | null
          place?: string | null
          plot_total_units?: number | null
          processtype?: string | null
          projectaddress?: string | null
          projectaddress2?: string | null
          projectapprovedate?: string | null
          projectdesc?: string | null
          projectname?: string | null
          projectprogress?: string | null
          projectregid?: number
          projectstatus?: string | null
          projecttype?: string | null
          promotername?: string | null
          promotertype?: string | null
          rerasubmissiondate?: string | null
          residential_total_balcony_area?: number | null
          residential_total_carpet_area?: number | null
          residential_total_received_amount?: number | null
          residential_total_unit_consideration?: number | null
          residential_total_units?: number | null
          score?: string | null
          shop_total_balcony_area?: number | null
          shop_total_carpet_area?: number | null
          shop_total_received_amount?: number | null
          shop_total_unit_consideration?: number | null
          shop_total_units?: number | null
          startdate?: string | null
          subtotaloflandcosta?: number | null
          subtotofdevelopcosta?: number | null
          subtotofdevelopcostb?: number | null
          timelaps?: string | null
          total_balcony_area?: number | null
          total_builtup_area?: number | null
          total_carpet_area?: number | null
          total_received_amount?: number | null
          total_unit_consideration?: number | null
          total_units?: number | null
          totalcostincurredandpaid?: number | null
          totalestimatedcostoftherealestateproject?: number | null
          totareaofland?: number | null
          totcarpetareaforprojectunderreg?: number | null
          totcoverdarea?: number | null
          totlandareaforprojectunderreg?: number | null
          totopenarea?: number | null
          tpname?: string | null
          tpno?: string | null
          tpo_code?: string | null
          underredevelopment?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      dashboard_financial_health: {
        Row: {
          total_dev_cost: number | null
          total_interest_charges: number | null
          total_land_cost: number | null
          total_net_cash_flow: number | null
          total_taxes_premiums: number | null
        }
        Relationships: []
      }
      dashboard_projects_by_location: {
        Row: {
          count: number | null
          location: string | null
        }
        Relationships: []
      }
      dashboard_projects_by_promoter_type: {
        Row: {
          count: number | null
          promotertype: string | null
        }
        Relationships: []
      }
      dashboard_projects_by_type: {
        Row: {
          count: number | null
          projecttype: string | null
        }
        Relationships: []
      }
      dashboard_sales_booking_performance: {
        Row: {
          booked_units: number | null
          revenue_per_unit: number | null
          total_revenue: number | null
          total_units: number | null
        }
        Relationships: []
      }
      dashboard_top10_promoters: {
        Row: {
          count: number | null
          promotername: string | null
        }
        Relationships: []
      }
      dashboard_yearly_avg_unit_consideration: {
        Row: {
          avg_unit_consideration: number | null
          year: number | null
        }
        Relationships: []
      }
      dashboard_yearly_projects_approved: {
        Row: {
          projects_approved: number | null
          year: number | null
        }
        Relationships: []
      }
      project_locations_summary: {
        Row: {
          avg_booking_percentage: number | null
          count: number | null
          location: string | null
        }
        Relationships: []
      }
      project_status_summary: {
        Row: {
          active_projects: number | null
          avg_booking_percentage: number | null
          avg_collection_percentage: number | null
          avg_progress: number | null
          completed_projects: number | null
          delayed_projects: number | null
          total_projects: number | null
          total_spend: number | null
          total_value: number | null
          unreported_projects: number | null
        }
        Relationships: []
      }
      project_types_summary: {
        Row: {
          count: number | null
          projecttype: string | null
        }
        Relationships: []
      }
      promoter_types_summary: {
        Row: {
          count: number | null
          promotertype: string | null
        }
        Relationships: []
      }
      top_promoters_summary: {
        Row: {
          count: number | null
          promotername: string | null
        }
        Relationships: []
      }
      yearly_projects_summary: {
        Row: {
          avg_unit_consideration: number | null
          distname: string | null
          projects_approved: number | null
          projectstatus: string | null
          projecttype: string | null
          year: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_avg_booking_percentage: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_avg_project_progress: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_dashboard_project_summary: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_projects: number
          active_projects: number
          completed_projects: number
          delayed_projects: number
          unreported_projects: number
          total_value: number
          total_spend: number
          avg_booking_percentage: number
          avg_collection_percentage: number
          avg_progress: number
        }[]
      }
      get_market_overview_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_project_summary_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_total_area_of_land: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_total_project_value: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_total_projects_count: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_total_received_amount: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      safe_to_numeric: {
        Args: { v: string }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
