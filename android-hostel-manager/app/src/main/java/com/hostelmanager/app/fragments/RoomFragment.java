package com.hostelmanager.app.fragments;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.fragment.app.Fragment;
import androidx.cardview.widget.CardView;

import com.hostelmanager.app.R;
import com.hostelmanager.app.api.ApiClient;
import com.hostelmanager.app.api.responses.RoomResponse;
import com.hostelmanager.app.models.Room;
import com.hostelmanager.app.models.User;
import com.hostelmanager.app.utils.MockDataProvider;
import com.hostelmanager.app.utils.SharedPrefsManager;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class RoomFragment extends Fragment {
    
    private View rootView;
    private TextView tvRoomNumber, tvRoomType, tvFloor, tvCapacity, tvOccupied;
    private TextView tvRoommatesContent;
    private CardView roomDetailsCard, roommatesCard;
    private View noRoomView;
    
    private SharedPrefsManager sharedPrefsManager;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        rootView = inflater.inflate(R.layout.fragment_room, container, false);
        
        sharedPrefsManager = new SharedPrefsManager(getContext());
        initViews();
        loadRoomInfo();
        
        return rootView;
    }
    
    private void initViews() {
        roomDetailsCard = rootView.findViewById(R.id.roomDetailsCard);
        roommatesCard = rootView.findViewById(R.id.roommatesCard);
        noRoomView = rootView.findViewById(R.id.noRoomView);
        
        tvRoomNumber = rootView.findViewById(R.id.tvRoomNumber);
        tvRoomType = rootView.findViewById(R.id.tvRoomType);
        tvFloor = rootView.findViewById(R.id.tvFloor);
        tvCapacity = rootView.findViewById(R.id.tvCapacity);
        tvOccupied = rootView.findViewById(R.id.tvOccupied);
        tvRoommatesContent = rootView.findViewById(R.id.tvRoommatesContent);
    }
    
    private void loadRoomInfo() {
        String token = sharedPrefsManager.getToken();
        if (token == null) {
            showNoRoom();
            return;
        }
        
        ApiClient.getApiInterface().getMyRoom("Bearer " + token).enqueue(new Callback<RoomResponse>() {
            @Override
            public void onResponse(Call<RoomResponse> call, Response<RoomResponse> response) {
                if (response.isSuccessful() && response.body() != null && response.body().getRoom() != null) {
                    displayRoomInfo(response.body().getRoom());
                } else {
                    showNoRoom();
                }
            }
            
            @Override
            public void onFailure(Call<RoomResponse> call, Throwable t) {
                // Use mock data for demo
                Room mockRoom = MockDataProvider.getMockRoom();
                displayRoomInfo(mockRoom);
            }
        });
    }
    
    private void displayRoomInfo(Room room) {
        roomDetailsCard.setVisibility(View.VISIBLE);
        roommatesCard.setVisibility(View.VISIBLE);
        noRoomView.setVisibility(View.GONE);
        
        tvRoomNumber.setText(room.getRoomNumber());
        tvRoomType.setText(capitalizeFirst(room.getRoomType()));
        tvFloor.setText(room.getFloor());
        tvCapacity.setText(String.valueOf(room.getCapacity()));
        tvOccupied.setText(String.valueOf(room.getOccupied()));
        
        // Display roommates
        if (room.getRoommates() != null && !room.getRoommates().isEmpty()) {
            StringBuilder roommatesText = new StringBuilder();
            for (User roommate : room.getRoommates()) {
                roommatesText.append("• ").append(roommate.getName()).append("\n");
                roommatesText.append("  ").append(roommate.getEmail()).append("\n");
                if (roommate.getPhone() != null && !roommate.getPhone().isEmpty()) {
                    roommatesText.append("  ").append(roommate.getPhone()).append("\n");
                }
                roommatesText.append("\n");
            }
            tvRoommatesContent.setText(roommatesText.toString().trim());
        } else {
            tvRoommatesContent.setText(getString(R.string.no_roommates));
        }
    }
    
    private void showNoRoom() {
        roomDetailsCard.setVisibility(View.GONE);
        roommatesCard.setVisibility(View.GONE);
        noRoomView.setVisibility(View.VISIBLE);
    }
    
    private String capitalizeFirst(String text) {
        if (text == null || text.isEmpty()) return text;
        return text.substring(0, 1).toUpperCase() + text.substring(1);
    }
}
